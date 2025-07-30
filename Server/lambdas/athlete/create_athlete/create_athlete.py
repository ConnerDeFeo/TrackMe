import json
from dynamodb_client import put_item


#Create athlete
def create_athlete(event, context):
    body = json.loads(event['body'])
    # Put item in DynamoDB
    response = put_item('athletes', {
        'username': body['username'],
        'first_name': body['first_name'],
        'last_name': body['last_name'],
        'email': body['email'],
        'password': body['password']
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