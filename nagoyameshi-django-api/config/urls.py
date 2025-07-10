from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from api import views
from api.views import CreatePortalSessionView, CreateCheckoutSessionView, StripeWebhookView, ConfirmSubscriptionView

router = DefaultRouter()
router.register(r'restaurants', views.RestaurantViewSet, basename='restaurant')
router.register(r'reservations', views.ReservationViewSet, basename='reservation')
router.register(r'reviews', views.ReviewViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'favorites', views.FavoriteViewSet, basename='favorite')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/', include(router.urls)),
    path('api/create-portal-session/', CreatePortalSessionView.as_view(), name='create-portal-session'),
    path('api/create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path("api/stripe/webhook/", StripeWebhookView.as_view(), name="stripe-webhook"),
    path('api/confirm-subscription/', ConfirmSubscriptionView.as_view(), name='confirm-subscription'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
