import os
import json
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Parse the authorization code from query parameters
    code = event['queryStringParameters'].get('code')
    if not code:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Authorization code not provided"})
        }

    client_id = os.environ['GOOGLE_CLIENT_ID']
    client_secret = os.environ['GOOGLE_CLIENT_SECRET']
    redirect_uri = os.environ['GOOGLE_REDIRECT_URI']
    
    # Exchange the authorization code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(token_url, data=payload, headers=headers)

    if response.status_code != 200:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Failed to obtain tokens", "details": response.text})
        }

    tokens = response.json()
    id_token_str = tokens.get('id_token')

    try:
        # Verify and parse the ID token
        id_info = id_token.verify_oauth2_token(id_token_str, google_requests.Request(), client_id)

        # Extract the user_id from the 'sub' field
        user_id = id_info.get('sub')

        # Get additional user information if needed
        email = id_info.get('email')

        # Save tokens to DynamoDB for future use
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('UserTokens')
        
        table.put_item(
            Item={
                'user_id': user_id,
                'access_token': tokens.get('access_token'),
                'refresh_token': tokens.get('refresh_token'),
                'id_token': id_token_str,
                'expires_in': tokens.get('expires_in'),
                'email': email,
                'issued_at': id_info.get('iat'),
                'last_updated': id_info.get('iat')
            }
        )

        # Redirect to a success page or home page
        return {
            "statusCode": 302,
            "headers": {
                "Location": "http://fitboost-sunhacks-frontend.s3-website.us-east-2.amazonaws.com/static/html/dashboard.html"
            }
        }

    except ValueError as e:
        # Invalid token
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid ID token", "details": str(e)})
        }
