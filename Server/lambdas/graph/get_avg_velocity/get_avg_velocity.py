import json
from user_auth import get_user_info, get_auth_header
from rds import fetch_all

def get_avg_velocity(event, context):
    auth_header = get_auth_header()
    try:
        pass
    except Exception as e:
        print(f"Error occurred while getting average velocity: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"}),
            "headers": auth_header
        }