import json
from dynamodb_client import put_item


#Create athlete
def create_athlete(event, context):
    body = json.loads(event['body']) 

    # Attempt athlete creation
    try:
        put_item('athletes', {
            'userId': body['userId']
        }, "attribute_not_exists(userId)")
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:8081", 
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Athlete created successfully"})
        }

    # If athlete already exists, return error
    except Exception as e:
        return {
            "statusCode": 409,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:8081",  
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Athlete already exists"})
        }