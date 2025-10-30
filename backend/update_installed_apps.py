import re

settings_file = 'eyecare/settings.py'

with open(settings_file, 'r') as file:
    content = file.read()

# Add contact app to INSTALLED_APPS
if "'contact'" not in content:
    content = content.replace(
        "'consultations',",
        "'consultations',\n    'contact',"
    )

with open(settings_file, 'w') as file:
    file.write(content)

print("Contact app added to INSTALLED_APPS!")
