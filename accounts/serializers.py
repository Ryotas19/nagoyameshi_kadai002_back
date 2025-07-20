from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'plan', 'stripe_customer_id', 'stripe_subscription_id')

class CustomRegisterSerializer(RegisterSerializer):
    # 追加フィールドを書く（今回は無くてもOK。phone_numberを追加したい場合の例↓）
    # phone_number = serializers.CharField(required=False)

    def custom_signup(self, request, user):
        # カスタムサインアップ処理（現状は不要）
        pass