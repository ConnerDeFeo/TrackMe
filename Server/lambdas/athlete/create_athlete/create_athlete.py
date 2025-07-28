import boto3
import os
import json
from dotenv import load_dotenv
import time

# Load environment variables once at module level (not on every invocation)
load_dotenv()
start_time = time.time()
# Create DynamoDB resource once at module level for reuse across invocations
dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=os.getenv("DYNAMODB_ENDPOINT_URL"),
    aws_access_key_id="dummy",
    aws_secret_access_key="dummy",
    region_name="us-east-2"
)
print("Connecting to DynamoDB duration: ", time.time() - start_time)
# Get table reference once at module level

start_time = time.time()
table = dynamodb.Table('athletes')
print("Getting table reference duration: ", time.time() - start_time)

def create_athlete(event, context):
    body = json.loads(event['body'])
    # Put item in DynamoDB
    start_time = time.time()
    table.put_item(Item=
        {
            'username': body['username'],
            'first_name': body['first_name'],
            'last_name': body['last_name'],
            'email': body['email'],
            'password': body['password']
        }
    )
    print("Putting item in DynamoDB duration: ", time.time() - start_time)

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"message": "Athlete created successfully"})
    }