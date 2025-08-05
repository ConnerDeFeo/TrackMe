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

def update_item(table_name, key, update_expression, expression_attribute_names=None, expression_attribute_values=None):
    table = _connection.Table(table_name)
    params = {
        'Key': key,
        'UpdateExpression': update_expression,
        'ReturnValues': "UPDATED_NEW"
    }
    if expression_attribute_names:
        params['ExpressionAttributeNames'] = expression_attribute_names
    if expression_attribute_values:
        params['ExpressionAttributeValues'] = expression_attribute_values

    return table.update_item(**params)

#Query items from a table based on a key condition expression
def query_items(table_name, key_condition_expression, expression_attribute_names=None, expression_attribute_values=None):
    table = _connection.Table(table_name)
    params = {
        'KeyConditionExpression': key_condition_expression
    }

    if expression_attribute_names:
        params['ExpressionAttributeNames'] = expression_attribute_names
    if expression_attribute_values:
        params['ExpressionAttributeValues'] = expression_attribute_values

    return table.query(**params)
