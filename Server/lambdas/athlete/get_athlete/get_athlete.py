import json
from dynamodb_client import get_item

#Get athlete by username
def get_athlete(event, context):
    body = json.loads(event['body'])
    # Get item from DynamoDB
    response = get_item('athletes', {'username': body['username']})
    
    # If athlete found, return success
    if response['Item']:
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Athlete retrieved successfully", "athlete": response['Item']})
        }
    # If athlete not found, return error
    else:
        return {
            "statusCode": 404,
            "body": json.dumps({"message": "Athlete not found"})
        }