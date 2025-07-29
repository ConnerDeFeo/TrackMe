import json
from layers.common.python.dynamodb_client import athletes_table
def get_athlete(event, context):
    body = json.loads(event['body'])
    # Get item from DynamoDB
    athletes_table.get_item(Key={'username': body['username']})
    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Athlete retrieved successfully"})
    }