import json
from rds import execute_commit
from user_auth import get_user_info

#Create athlete
def create_coach(event, context):

    # Attempt athlete creation
    try:
        user_info = get_user_info(event)
        user_id = user_info['user_id']
        username = user_info['username']
        #Insert coach into the database
        execute_commit("INSERT INTO coaches (userId, username) VALUES (%s, %s)", (user_id, username))
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:8081", 
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Coach created successfully"})
        }

    # If athlete already exists, return error
    except Exception as e:
        print(f"Error creating coach: {str(e)}")
        return {
            "statusCode": 409,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:8081",  
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Coach already exists"})
        }
