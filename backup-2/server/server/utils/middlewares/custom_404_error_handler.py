from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.urls import resolve
from server.utils.messages.error_messages import error_code_e410


class Custom404Middleware(MiddlewareMixin):
    def process_response(self, request, response):
        if response.status_code == 404:
            return JsonResponse(error_code_e410(), status=404)
        return response
