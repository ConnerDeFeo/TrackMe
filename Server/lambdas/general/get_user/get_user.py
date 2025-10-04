import json
from rds import fetch_one
from user_auth import get_user_info

def get_user(event, context):

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        data = fetch_one("SELECT * FROM users WHERE userId = %s", (user_id,))
        if data:
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "username": data[1],
                    "bio": data[2],
                    "firstName": data[3],
                    "lastName": data[4],
                })
            }
        return {
            "statusCode": 404,
            "body": json.dumps({"message": "User not found"})
        }
    except Exception as e:
        print(f"Error fetching user: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error fetching user"})
        }