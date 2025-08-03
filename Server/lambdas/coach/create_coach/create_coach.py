import json
from rds import execute_commit

#Create athlete
def create_coach(event, context):
    body = json.loads(event['body']) 

    # Attempt athlete creation
    try:
        #Insert coach into the database
        execute_commit("INSERT INTO coaches (userId, username) VALUES (%s, %s)", (body['userId'], body['username']))
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
