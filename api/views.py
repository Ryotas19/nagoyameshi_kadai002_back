# api/views.py
from django.db.models import Avg

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseBadRequest
from django.utils.decorators import method_decorator

import stripe
from django.conf import settings

from accounts.models import CustomUser
from .models import Restaurant, Review, Category, Favorite, Reservation
from .serializers import (
    RestaurantSerializer,
    ReviewSerializer,
    CategorySerializer,
    FavoriteSerializer,
    ReservationSerializer,
)
from .permissions import IsPremiumUser, IsOwnerOrReadOnly

# Stripe シークレットキーを設定
stripe.api_key = settings.STRIPE_SECRET_KEY


class RestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Restaurant.objects.all().order_by("id")
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category"]
    search_fields = ["name", "description", "address"]
    ordering_fields = ["avg_rating", "id", "price_min"]
    
    def get_queryset(self):
        return Restaurant.objects.annotate(
            avg_rating=Avg('reviews__rating')
        )


    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsPremiumUser])
    def favorite(self, request, pk=None):
        restaurant = self.get_object()
        fav, created = Favorite.objects.get_or_create(
            user=request.user, restaurant=restaurant
        )
        if not created:
            fav.delete()
            return Response({"status": "unfavorited"})
        return Response({"status": "favorited"})


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action == 'create':
            classes = [IsAuthenticated, IsPremiumUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            classes = [IsOwnerOrReadOnly]
        else:
            classes = [AllowAny]
        return [cls() for cls in classes]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class FavoriteViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)


class ReservationViewSet(viewsets.ModelViewSet):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated, IsPremiumUser]

    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user).order_by(
            "-reservation_date", "-reservation_time"
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CreatePortalSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # stripe_customer_id がなければ作成
            if not request.user.stripe_customer_id:
                cust = stripe.Customer.create(email=request.user.email)
                request.user.stripe_customer_id = cust.id
                request.user.save()

            # Billing Portal セッションを作成
            portal = stripe.billing_portal.Session.create(
                customer=request.user.stripe_customer_id,
                return_url=f"{settings.FRONTEND_URL}/mypage"
            )
            return Response({"url": portal.url})
        except Exception as e:
            print("🚨 PortalSession error:", e)
            return Response(
                {"error": "ポータル起動に失敗しました。"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # 顧客情報取得 or 作成
        if not request.user.stripe_customer_id:
            customer = stripe.Customer.create(email=request.user.email)
            request.user.stripe_customer_id = customer.id
            request.user.save()
        else:
            customer = stripe.Customer.retrieve(request.user.stripe_customer_id)

        price_id = request.data.get("priceId")
        domain = settings.FRONTEND_URL.rstrip("/")
        try:
            session = stripe.checkout.Session.create(
                customer=customer.id,
                payment_method_types=["card"],
                line_items=[{"price": price_id, "quantity": 1}],
                mode="subscription",
                success_url=f"{domain}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",

                cancel_url=f"{domain}/upgrade/cancel",
            )
            return Response({"url": session.url})
        except Exception as e:
            print("🚨 CheckoutSession error:", e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    authentication_classes = []  # Webhook は認証不要
    permission_classes = []

    def post(self, request, *args, **kwargs):
        payload    = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, stripe.error.SignatureVerificationError) as e:
            print("🚨 Webhook signature error:", e)
            return HttpResponseBadRequest()

        typ      = event["type"]
        obj      = event["data"]["object"]
        cust_id  = obj.get("customer")
        user = CustomUser.objects.filter(stripe_customer_id=cust_id).first()
        if not user:
            return HttpResponse(status=200)

        # ── 購読開始 or 再開 ─────────────────────────────────────────
        if typ in ("checkout.session.completed", "invoice.payment_succeeded"):
            # checkout.session.completed は subscription
            # invoice.payment_succeeded は invoice.object.lines.data[0].subscription
            sub_id = obj.get("subscription") or (
                obj.get("lines", {}).get("data", [{}])[0].get("subscription")
            )
            user.plan = "premium"
            user.stripe_subscription_id = sub_id
            user.save()
            print(f"✅ {user.email} は premium になりました")

        # ── 完全解約 ────────────────────────────────────────────────
        elif typ == "customer.subscription.deleted":
            user.plan = "free"
            user.stripe_subscription_id = ""
            user.save()
            print(f"✅ {user.email} は free に戻りました")

        # ── 定期更新でキャンセル予約（cancel_at_period_end）された場合 ────
        elif typ == "customer.subscription.updated":
            # 即時キャンセル or period_end 終了後キャンセル
            status = obj.get("status")
            cancel_at_period_end = obj.get("cancel_at_period_end", False)
            if status == "canceled" or cancel_at_period_end:
                user.plan = "free"
                user.stripe_subscription_id = ""
                user.save()
                print(f"✅ {user.email} は free に戻りました (updated)")

        return HttpResponse(status=200)

class ConfirmSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        session_id = request.data.get('session_id')
        if not session_id:
            return Response({"error": "session_id が必要です"}, status=400)

        sess = stripe.checkout.Session.retrieve(session_id)
        cust_id, sub_id = sess.customer, sess.subscription

        try:
            u = CustomUser.objects.get(stripe_customer_id=cust_id)
        except CustomUser.DoesNotExist:
            u = request.user

        u.plan = "premium"
        u.stripe_subscription_id = sub_id
        u.save()
        return Response({"status": "ok"})
