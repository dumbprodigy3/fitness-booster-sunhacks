import os
import urllib.parse

def lambda_handler(event, context):
    client_id = os.environ['GOOGLE_CLIENT_ID']
    redirect_uri = os.environ['GOOGLE_REDIRECT_URI']
    scope = "openid email profile https://www.googleapis.com/auth/fitness.activity.read"
    state = 'secure_random_string'

    # Construct Google OAuth 2.0 URL
    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        + urllib.parse.urlencode({
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": scope,
            "access_type": "offline",
            "state": state
        })
    )

    # Return a redirect response
    return {
        "statusCode": 302,
        "headers": {
            "Location": auth_url
        }
    }
