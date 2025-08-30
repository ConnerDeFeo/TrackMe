import json
from rds import fetch_one

def get_user(event, context):
    body = json.loads(event['body'])
    mapping = {"Athlete": "athletes", "Coach": "coaches"}

    try:
        user_id = body['userId']
        account_type = body['accountType']
        data = fetch_one(f"SELECT * FROM {mapping[account_type]} WHERE userId = %s", (user_id,))
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