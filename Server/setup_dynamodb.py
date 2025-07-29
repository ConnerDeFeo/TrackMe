import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource(
        'dynamodb',
        endpoint_url='http://localhost:8000',
        region_name='us-east-2',
        aws_access_key_id='dummy',
        aws_secret_access_key='dummy'
    )

def create_athlete_table():
    athletes_table = 'athletes'
    # Check if table exists
    try:
        table = dynamodb.Table(athletes_table)
        table.load()  # Tries to load the table metadata
        print(f"Table '{athletes_table}' already exists.")
    except ClientError as e:
        print(f"Table '{athletes_table}' does not exist. Creating...")
        table = dynamodb.create_table(
            TableName=athletes_table,
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
        table.wait_until_exists()
        print(f"Table '{athletes_table}' created successfully.")

create_athlete_table()