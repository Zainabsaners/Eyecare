#!/usr/bin/env bash
set -o errexit

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Making database migrations ==="
python manage.py makemigrations --noinput

echo "=== Applying database migrations ==="
python manage.py migrate --noinput

echo "=== Collecting static files ==="
python manage.py collectstatic --noinput

echo "=== Creating initial users ==="
# Use environment variables for sensitive data
python manage.py shell -c "
import os
from django.contrib.auth import get_user_model
User = get_user_model()

# Get credentials from environment with fallbacks
superuser_username = os.environ.get('SUPERUSER_USERNAME', 'Achievers')
superuser_email = os.environ.get('SUPERUSER_EMAIL', 'triniquezainab@gmail.com')
superuser_password = os.environ.get('SUPERUSER_PASSWORD', 'achievers@123')

if not User.objects.filter(username=superuser_username).exists():
    # Create superuser
    User.objects.create_superuser(superuser_username, superuser_email, superuser_password)
    
    # Create other users
    User.objects.create_user(
        'StacyKivindyo', 
        'stacykivindyo@gmail.com', 
        'stacy@123', 
        first_name='Stacy', 
        last_name='Kivindyo', 
        user_type='specialist'
    )
    User.objects.create_user(
        'ZainabSaners', 
        'zainabsaners@gmail.com', 
        'zainab@123', 
        first_name='Zainab', 
        last_name='Saners', 
        user_type='patient'
    )
    print('✅ Initial users created!')
else:
    print('✅ Users already exist')
"