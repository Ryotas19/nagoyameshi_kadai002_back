from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # AbstractUserからusername, email, passwordなどのフィールドを継承します
    
    # 有料会員機能のためのフィールド
    PLAN_CHOICES = (
        ('free', '無料プラン'),
        ('premium', 'プレミアムプラン'),
    )
    plan = models.CharField(max_length=10, choices=PLAN_CHOICES, default='free', verbose_name="プラン")
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True, verbose_name="Stripe顧客ID")
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True, verbose_name="StripeサブスクリプションID")

    def __str__(self):
        return self.email