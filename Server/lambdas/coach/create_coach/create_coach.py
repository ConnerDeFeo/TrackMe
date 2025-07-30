import json
from dynamodb_client import put_item

#Create coach
def create_coach(event, context):
    # Put item in DynamoDB
    response = put_item('coaches', {
        'username': event['username'],
        'first_name': event['first_name'],
        'last_name': event['last_name'],
        'email': event['email'],
        'password': event['password']
    })

    # If coach created successfully, return success
    if response['ResponseMetadata']['HTTPStatusCode'] == 200:
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": "Coach created successfully"})
        }
    # If coach already exists, return error
    else:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": "Coach already exists"})
        }
