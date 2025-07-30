import json
from dynamodb_client import get_item

#Get coach by username
def get_coach(event, context):
    body = json.loads(event['body'])
    # Get item from DynamoDB
    response = get_item('coaches', {'username': body['username']})
    
    # If coach found, return success
    if response['Item']:
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Coach retrieved successfully", "coach": response['Item']})
        }
    # If coach not found, return error
    else:
        return {
            "statusCode": 404,
            "body": json.dumps({"message": "Coach not found"})
        }