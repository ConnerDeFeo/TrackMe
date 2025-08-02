import json

from rds import execute
import datetime

#Create group for a coach
def create_group(event, context):
    # Get group data from the request body
    try:
        body = json.loads(event['body'])
        group_name = body['groupName']
        userId = body['userId']
        today = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")

        # Create group in RDS with the current date
        execute('INSERT INTO groups (coachId, name, dateCreated) VALUES (%s, %s, %s)', (userId, group_name, today))

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:8081",
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message":"Group created successfully"})
        }

    except Exception as e:
        print(f"Error creating group: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:8081",
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Internal server error", "error": str(e)})
        }