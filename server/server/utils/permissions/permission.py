from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from datetime import datetime, timezone
import jwt

from django.conf import settings
from admin_management.models import AdminEmails
from decouple import config
from server.utils.messages.error_messages import (
    error_code_e401,
    error_code_e402,
    error_code_e403,
)


class CustomIsAuthenticated(BaseAuthentication):
    def authenticate(self, request):
        
        token = request.META.get("HTTP_AUTHORIZATION")
        if not token or not token.startswith("Bearer "):
            raise AuthenticationFailed(error_code_e401())

        token = token.split(" ")[1]
        print("token", token, token)

        try:
            decoded_token = jwt.decode(
                token, config("SECRET_KEY"), algorithms=["HS256"]
            )
            if decoded_token["token_type"] != "access":
                raise AuthenticationFailed(error_code_e403())

            if "exp" in decoded_token:
                expiry_timestamp = datetime.fromtimestamp(
                    decoded_token["exp"], tz=timezone.utc
                )
                if expiry_timestamp < datetime.now(tz=timezone.utc):
                    raise AuthenticationFailed(error_code_e402())
            else:
                raise AuthenticationFailed(error_code_e403())
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(error_code_e402())
        except jwt.InvalidTokenError:
            raise AuthenticationFailed(error_code_e403())
        return self.get_user_and_token(request, token)

    def get_user_and_token(self, request, token):
        
        decoded_token = jwt.decode(token, config("SECRET_KEY"), algorithms=["HS256"])
        user_id = decoded_token.get("user_id")
        try:
            user = AdminEmails.objects.get(id=user_id)
        except AdminEmails.DoesNotExist:
            raise AuthenticationFailed(error_code_e403())
        return user, token

    def authenticate_header(self, request):
        return 'Bearer realm="api"'
