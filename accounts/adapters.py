from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings

class CustomAccountAdapter(DefaultAccountAdapter):
    def send_confirmation_mail(self, request, emailconfirmation, signup):
        activate_url = f"{settings.FRONTEND_URL}/confirm-email/?key={emailconfirmation.key}"
        ctx = {
            "user": emailconfirmation.email_address.user,
            "activate_url": activate_url,
            "current_site": None,
            "key": emailconfirmation.key,
        }
        # ★ ここが正しい呼び出し方（template_prefix, email, context のみ！）
        self.send_mail(
            'account/email/email_confirmation',
            emailconfirmation.email_address.email,
            ctx
        )
