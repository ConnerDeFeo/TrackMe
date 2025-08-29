import json
from rds import fetch_one

def get_user(event, context):
    body = json.loads(event['body'])

    try:
        user_id = body['userId']
        account_type = body['account_type']
        data = fetch_one("SELECT * FROM %s WHERE userId = %s", (account_type.lower(), user_id))
        if data:
            return {
                "statusCode": 200,
                "body": json.dumps(data)
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