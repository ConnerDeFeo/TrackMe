from rds import fetch_all
import boto3
import os
from dotenv import load_dotenv

def debug_table():
    tables = fetch_all("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")
    if not tables:
        print("No tables found.")
        return

    for (table_name,) in tables:
        rows = fetch_all(f"SELECT * FROM {table_name}")
        print(f"\nTable: {table_name}")
        if not rows:
            print("No rows found.")
        else:
            for row in rows:
                print(row)
def reset_dynamo():
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
                'AttributeName': 'group_date_identifier',
                'KeyType': 'HASH'
            },
            {
                'AttributeName': 'input_type',
                'KeyType': 'RANGE'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'group_date_identifier',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'input_type',
                'AttributeType': 'S'
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    )
