import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource(
        'dynamodb',
        endpoint_url='http://localhost:8000',
        region_name='us-east-2',
        aws_access_key_id='dummy',
        aws_secret_access_key='dummy'
    )

def create_table(table_name):
    # Check if table exists
    try:
        table = dynamodb.Table(table_name)
        table.load()  # Tries to load the table metadata
        print(f"Table '{table_name}' already exists.")
    except ClientError as e:
        print(f"Table '{table_name}' does not exist. Creating...")
        table = dynamodb.create_table(
            TableName=table_name,
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
        print(f"Table '{table_name}' created successfully.")

create_table('athletes')
create_table('athletes_test')
create_table('coaches')
create_table('coaches_test')