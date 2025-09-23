import json
from rds import fetch_one
from user_auth import get_user_info

def get_user(event, context):
    mapping = {"Athlete": "athletes", "Coach": "coaches"}

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        account_type = user_info['accountType']
        data = fetch_one(f"SELECT * FROM {mapping[account_type]} WHERE userId = %s", (user_id,))
        if data:
            if account_type == "Athlete":
                return {
                    "statusCode": 200,
                    "body": json.dumps({
                        "username": data[1],
                        "bio": data[2],
                        "firstName": data[3],
                        "lastName": data[4],
                        "gender": data[5],
                        "profilePictureUrl": data[6],
                        "bodyWeight": data[7],
                        "tffrsUrl": data[8]
                })
            }
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "username": data[1],
                    "bio": data[2],
                    "firstName": data[3],
                    "lastName": data[4],
                    "gender": data[5],
                    "profilePictureUrl": data[6]
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