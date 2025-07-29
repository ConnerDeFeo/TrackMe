import boto3
import os
from dotenv import load_dotenv
load_dotenv() #Load environment variables

# Create DynamoDB resource once at module level for reuse across invocations
dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=os.getenv("DYNAMODB_ENDPOINT_URL"),
    aws_access_key_id="dummy",
    aws_secret_access_key="dummy",
    region_name="us-east-2"
)
# Get table reference once at module level
athletes_table = dynamodb.Table('athletes')