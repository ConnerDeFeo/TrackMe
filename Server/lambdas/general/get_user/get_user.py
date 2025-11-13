import json
from rds import fetch_one
from user_auth import get_user_info, get_auth_header

def get_user(event, context):
    auth_header = get_auth_header()
    query_params = event.get('queryStringParameters') or {}

    try:
        user_info = get_user_info(event)
        user_id = query_params.get('userId', user_info['userId'])
        data = fetch_one("SELECT username, bio, firstName, lastName, profilePicUrl, accountType FROM users WHERE userId = %s", (user_id,))
        if data:
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "username": data[0],
                    "bio": data[1],
                    "firstName": data[2],
                    "lastName": data[3],
                    "profilePicUrl": data[4],
                    "accountType": data[5]
                }),
                'headers': auth_header
            }
        return {
            "statusCode": 404,
            "body": json.dumps({"message": "User not found"}),
            'headers': auth_header
        }
    except Exception as e:
        print(f"Error fetching user: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error fetching user"}),
            'headers': auth_header
        }