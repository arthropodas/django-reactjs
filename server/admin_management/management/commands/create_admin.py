from django.core.management.base import BaseCommand
from admin_management.models import Admin
from decouple import config

class Command(BaseCommand):
    help = 'Create a user with a securely hashed password'
   
    def handle(self, *args, **options):
      
        password = config('ADMIN_PASSWORD')
        email= config('ADMIN_EMAIL')
       
       

        # Create a new user with a securely hashed password
        user = Admin(email=email)
        user.set_password(password)
        user.save()

       
