from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings

class CustomAccountAdapter(DefaultAccountAdapter):
    def send_confirmation_mail(self, request, emailconfirmation, signup):
        # Heroku環境変数 FRONTEND_URL を参照
        activate_url = f"{settings.FRONTEND_URL}/confirm-email/?key={emailconfirmation.key}"
        ctx = {
            "user": emailconfirmation.email_address.user,
            "activate_url": activate_url,
            "current_site": None,
            "key": emailconfirmation.key,
        }
        self.send_mail(
            'account/email/email_confirmation',
            emailconfirmation.email_address.email,
            ctx
        )
