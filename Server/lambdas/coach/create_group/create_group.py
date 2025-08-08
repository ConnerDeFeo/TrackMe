import json

from rds import execute_commit_fetch_one
from datetime import datetime, timezone

#Create group for a coach
def create_group(event, context):
    # Get group data from the request body
    try:
        body = json.loads(event['body'])
        group_name = body['groupName']
        userId = body['userId']
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        # Create group in RDS with the current date
        group_id = execute_commit_fetch_one('INSERT INTO groups (coachId, name, dateCreated) VALUES (%s, %s, %s) RETURNING id', (userId, group_name, today))

        print(group_id)
        if group_id:
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "http://localhost:8081",
                    "Access-Control-Allow-Credentials": True,
                    "Content-Type": "application/json"
                },
                "body": json.dumps({"message":"Group created successfully", "groupId": group_id[0]})
            }
        return {
            "statusCode": 404,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:8081",
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Group already exists or could not be created"})
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