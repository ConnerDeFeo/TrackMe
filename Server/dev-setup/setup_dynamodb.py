import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource(
        'dynamodb',
        endpoint_url='http://localhost:8000',
        region_name='us-east-2',
        aws_access_key_id='dummy',
        aws_secret_access_key='dummy'
    )

tables = ['athletes', 'athletes_test', 'coaches', 'coaches_test']

for table_name in tables:
    table = dynamodb.Table(table_name)
    try:
        table.delete()
        print(f"Table '{table_name}' deleted successfully.")
    except ClientError as e:
        continue

def create_user_tables(table_name):
    # Check if table exists
    try:
        table = dynamodb.Table(table_name)
        table.load()  # Tries to load the table metadata
        print(f"Table '{table_name}' already exists.")
    except ClientError as e:
        print(f"Table '{table_name}' does not exist. Creating...")
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=[ #Primary key
                {
                    'AttributeName': 'userId',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[ #The type for each attribute
                {
                    'AttributeName': 'userId',
                    'AttributeType': 'S' #This is a string
                },
                {
                    'AttributeName': 'groupId',
                    'AttributeType': 'S'  # String, for GSI
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5 
            },
            GlobalSecondaryIndexes=[ 
                {
                    'IndexName': 'GroupIndex',
                    'KeySchema': [
                        {
                            'AttributeName': 'groupId',
                            'KeyType': 'HASH'
                        }
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
            ]
        )
        table.wait_until_exists()
        print(f"Table '{table_name}' created successfully.")

for table in tables:
    create_user_tables(table)