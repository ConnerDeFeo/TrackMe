import boto3
import os
import json
from dotenv import load_dotenv

# Load environment variables once at module level (not on every invocation)
load_dotenv()

# Create DynamoDB resource once at module level for reuse across invocations
dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=os.getenv("DYNAMODB_ENDPOINT_URL"),
    aws_access_key_id="dummy",
    aws_secret_access_key="dummy",
    region_name="us-east-2"
)

# Get table reference once at module level
table = dynamodb.Table('athletes')


def create_athlete(event, context):
    # Put item in DynamoDB
    table.put_item(Item=
        {
            'first_name': event['first_name'],
            'last_name': event['last_name'],
            'email': event['email'],
            'password': event['password'],
            'username': event['username']
        }
    )
    
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"message": "Athlete created successfully"})
    }