# api/permissions.py
from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS

class IsPremiumUser(permissions.BasePermission):
    message = 'この機能を利用するには、プレミアムプランへのアップグレードが必要です。'
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.plan == 'premium'
        )

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    GET/HEAD/OPTIONS は誰でも OK。
    PATCH/DELETE/PUT はログイン済みかつリソースの user==request.user の場合のみ OK。
    """
    def has_permission(self, request, view):
        # 読み取り系は誰でも
        if request.method in SAFE_METHODS:
            return True
        # 書き込み系はログイン済み
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # 読み取り系は誰でも
        if request.method in SAFE_METHODS:
            return True
        # 更新／削除はオーナーのみ
        return obj.user == request.user
