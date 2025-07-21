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
        self.send_mail('account/email/email_confirmation_subject.txt', 
                       'account/email/email_confirmation_message.txt',
                       emailconfirmation.email_address.email, 
                       ctx)
