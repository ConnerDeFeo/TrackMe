import json

from dynamodb_client import put_item
import datetime

#Create group for a coach
def create_group(event, context):
    # Get group data from the request body
    try:
        body = json.loads(event['body'])
        group_name = body['groupName']
        userId = body['userId']
        today = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")

        # Create group in DynamoDB with the current date
        response = put_item('coaches', {
            'userId': userId,
            'groupName': group_name,
            'date':{
                f'{today}': {}
            },
            'createdAt': today
        }, 'attribute_not_exists(groupName)')

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:8081",
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Group created successfully", "group": response})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:8081",
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Internal server error", "error": str(e)})
        }