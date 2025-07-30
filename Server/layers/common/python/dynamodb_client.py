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

#Add item to table
def put_item(table_name, item):
    table = dynamodb.Table(table_name) #type: ignore
    return table.put_item(Item=item)

#Get item from table
def get_item(table_name, key):
    table = dynamodb.Table(table_name) #type: ignore
    return table.get_item(Key=key)

#Delete item from table
def delete_item(table_name, key):
    table = dynamodb.Table(table_name) #type: ignore
    return table.delete_item(Key=key)