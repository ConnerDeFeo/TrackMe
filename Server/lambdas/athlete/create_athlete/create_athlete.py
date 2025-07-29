import json
from layers.dynamodb_client import athletes_table

def create_athlete(event, context):
    body = json.loads(event['body'])
    # Put item in DynamoDB
    athletes_table.put_item(Item=
        {
            'username': body['username'],
            'first_name': body['first_name'],
            'last_name': body['last_name'],
            'email': body['email'],
            'password': body['password']
        }
    )
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"message": "Athlete created successfully"})
    }