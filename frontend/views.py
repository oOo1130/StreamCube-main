from django.shortcuts import render
from django.views.decorators.cache import never_cache
from verify_email.email_handler import send_verification_email

# Create your views here.
@never_cache
def index(request):
    return render(request, 'frontend/index.html')
