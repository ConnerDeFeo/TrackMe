import boto3
import json
from botocore.exceptions import ClientError

def create_dynamodb_tables():
    # Initialize DynamoDB client
    dynamodb = boto3.resource('dynamodb', 
                             endpoint_url='http://localhost:8000',
                             region_name='us-east-2',
                             aws_access_key_id='dummy',
                             aws_secret_access_key='dummy')
    
    # Athletes table
    athletes_table = dynamodb.create_table(
        TableName='athletes',
        KeySchema=[
            {
                'AttributeName': 'username',
                'KeyType': 'HASH'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'username',
                'AttributeType': 'S'
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    )

create_dynamodb_tables()