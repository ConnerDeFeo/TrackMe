import os
import boto3
from dotenv import load_dotenv
load_dotenv()

_connection = boto3.resource(
    'dynamodb',
    endpoint_url=os.getenv("DYNAMODB_ENDPOINT"),
    region_name=os.getenv("DYNAMODB_REGION"),
    aws_access_key_id=os.getenv("DYNAMODB_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("DYNAMODB_SECRET_KEY")
)

def put_item(table_name, item):
    table = _connection.Table(table_name)
    response = table.put_item(Item=item)
    return response

def get_item(table_name, key):
    table = _connection.Table(table_name)
    response = table.get_item(Key=key)
    return response.get('Item')

def delete_item(table_name, key):
    table = _connection.Table(table_name)
    response = table.delete_item(Key=key)
    return response