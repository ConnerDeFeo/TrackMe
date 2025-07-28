import json

def create_athlete(event, context):
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "athlete created",
        }),
    }