import json
from dynamodb_client import get_item


def get_athlete(event, context):
    # Get userId from path parameters
    userId = event['pathParameters']['userId']
    
    try:
        # Get athlete from DynamoDB
        response = get_item('athletes', {'userId': userId})
        
        # Check if athlete exists
        if 'Item' in response:
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "http://localhost:8081",
                    "Access-Control-Allow-Credentials": True,
                    "Content-Type": "application/json"
                },
                "body": json.dumps(response['Item'])
            }
        else:
            return {
                "statusCode": 404,
                "headers": {
                    "Access-Control-Allow-Origin": "http://localhost:8081",
                    "Access-Control-Allow-Credentials": True,
                    "Content-Type": "application/json"
                },
                "body": json.dumps({"message": "Athlete not found"})
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