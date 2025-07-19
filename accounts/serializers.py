from dj_rest_auth.registration.serializers import RegisterSerializer, UserDetailsSerializer
from rest_framework import serializers
from .models import CustomUser

class CustomRegisterSerializer(RegisterSerializer):
    # 新規登録時の追加フィールド（不要なら何も足さなくてOK）
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._has_phone_field = False  # これ必須！！

class CustomUserDetailsSerializer(UserDetailsSerializer):
    plan = serializers.CharField(read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        model = CustomUser
        fields = UserDetailsSerializer.Meta.fields + ('plan',)
