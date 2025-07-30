import json
from dynamodb_client import put_item


#Create athlete
def create_athlete(event, context):
    # Put item in DynamoDB
    response = put_item('athletes', {
        'username': event['username'],
        'first_name': event['first_name'],
        'last_name': event['last_name'],
        'email': event['email'],
        'password': event['password']
    })

    # If athlete created successfully, return success
    if response['ResponseMetadata']['HTTPStatusCode'] == 200:
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": "Athlete created successfully"})
        }
    # If athlete already exists, return error
    else:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": "Athlete already exists"})
        }