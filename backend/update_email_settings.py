import re

settings_file = 'eyecare/settings.py'

with open(settings_file, 'r') as file:
    content = file.read()

# Add email settings before the database section
email_settings = '''
# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # For development
# For production, use:
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'your-smtp-host'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'your-email@example.com'
# EMAIL_HOST_PASSWORD = 'your-email-password'

DEFAULT_FROM_EMAIL = 'noreply@eyecare-vision-ai.com'
'''

# Add email settings before database configuration
if 'EMAIL_BACKEND' not in content:
    content = content.replace(
        '# Database',
        email_settings + '\n\n# Database'
    )

with open(settings_file, 'w') as file:
    file.write(content)

print("Email settings added successfully!")
