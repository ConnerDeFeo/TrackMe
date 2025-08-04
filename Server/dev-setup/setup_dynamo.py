import os
import boto3
from dotenv import load_dotenv
load_dotenv()

_connection = boto3.resource('dynamodb',
    endpoint_url=os.getenv("DYNAMODB_ENDPOINT"),
    region_name=os.getenv("DYNAMODB_REGION"),
    aws_access_key_id=os.getenv("DYNAMODB_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("DYNAMODB_SECRET_KEY")
)

tables = ['Workouts', 'WorkoutInputs']
try:
    for table_name in tables:
        table = _connection.Table(table_name)
        table.delete()
        table.wait_until_not_exists()
except Exception:
    pass

_connection.create_table(
    TableName='Workouts',
    KeySchema=[
        {
            'AttributeName': 'coach_id',
            'KeyType': 'HASH'
        },
        {
            'AttributeName': 'title',
            'KeyType': 'RANGE'
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'coach_id',
            'AttributeType': 'S'
        },
        {
            'AttributeName': 'title',
            'AttributeType': 'S'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
    }
)

_connection.create_table(
    TableName = 'WorkoutInputs',             
    KeySchema=[
        {
            'AttributeName': 'coach_id',
            'KeyType': 'HASH'
        },
        {
            'AttributeName': 'date',
            'KeyType': 'RANGE'
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'coach_id',
            'AttributeType': 'S'
        },
        {
            'AttributeName': 'date',
            'AttributeType': 'S'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
    }
)
