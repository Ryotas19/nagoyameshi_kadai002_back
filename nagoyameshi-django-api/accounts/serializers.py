from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from .models import CustomUser

class CustomUserDetailsSerializer(UserDetailsSerializer):
    # Userモデルの'plan'フィールドをレスポンスに追加
    plan = serializers.CharField(read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        model = CustomUser
        # 元々のフィールドに'plan'を追加
        fields = UserDetailsSerializer.Meta.fields + ('plan',)