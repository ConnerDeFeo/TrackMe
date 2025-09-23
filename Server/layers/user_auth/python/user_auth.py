import os

def get_user_info(event):
    # If in production, extract user ID and account type from JWT claims
    if os.getenv("ENVIRONMENT") == "production":
        claims = event['requestContext']['authorizer']['claims']
        return {
            'user_id': claims['sub'],
            'accountType': claims['custom:accountType']
        }
    
    # Else manual extraction is needed for local testing
    try:
        import json
        import base64
        token = event['headers'].get('Authorization')

        # for local testing
        if token == "test":
            return {
                'user_id': event['test_data']['userId'],
                'accountType': event['test_data']['accountType']
            }

        if not token:
            raise Exception("Unauthorized: No Authorization header provided")
        if token.startswith('Bearer '):
            token = token[7:]

        parts = token.split('.')
        if len(parts) != 3:
            raise Exception("Unauthorized: Invalid token format")
        
        payload_part = parts[1]
        # Add padding if necessary
        payload_part += '=' * (4 - len(payload_part) % 4)

        payload = json.loads(base64.b64decode(payload_part).decode('utf-8'))
        return {
            'user_id': payload['sub'],
            'accountType': payload['custom:accountType']
        }
    except Exception as e:
        raise Exception(f"Unauthorized: {str(e)}")