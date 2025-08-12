import os
import boto3
from dotenv import load_dotenv
load_dotenv()

print("🔧 Setting up DynamoDB connection...")
print(f"Endpoint: {os.getenv('DYNAMODB_ENDPOINT')}")
print(f"Region: {os.getenv('DYNAMODB_REGION')}")

_connection = boto3.resource('dynamodb',
    endpoint_url=os.getenv("DYNAMODB_ENDPOINT"),
    region_name=os.getenv("DYNAMODB_REGION"),
    aws_access_key_id=os.getenv("DYNAMODB_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("DYNAMODB_SECRET_KEY")
)

print("📋 Listing existing tables...")
existing_tables = list(_connection.tables.all())
print(f"Found {len(existing_tables)} existing tables: {[t.name for t in existing_tables]}")

tables = ['Workouts', 'WorkoutInputs']
print(f"🗑️ Attempting to delete tables: {tables}")
try:
    for table_name in tables:
        print(f"  - Deleting table: {table_name}")
        table = _connection.Table(table_name)
        table.delete()
        print(f"  - Waiting for {table_name} to be deleted...")
        table.wait_until_not_exists()
        print(f"  ✅ {table_name} deleted successfully")
except Exception as e:
    print(f"  ⚠️ Error during deletion (expected if tables don't exist): {e}")

print("📦 Creating Workouts table...")
workouts_table = _connection.create_table(
    TableName='Workouts',
    KeySchema=[
        {
            'AttributeName': 'coach_id',
            'KeyType': 'HASH'
        },
        {
            'AttributeName': 'workout_id',
            'KeyType': 'RANGE'
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'coach_id',
            'AttributeType': 'S'
        },
        {
            'AttributeName': 'workout_id',
            'AttributeType': 'S'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
    }
)
print("  - Waiting for Workouts table to be active...")
workouts_table.wait_until_exists()
print("  ✅ Workouts table created successfully")

print("📦 Creating WorkoutInputs table...")
inputs_table = _connection.create_table(
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
print("  - Waiting for WorkoutInputs table to be active...")
inputs_table.wait_until_exists()
print("  ✅ WorkoutInputs table created successfully")

print("🎉 DynamoDB setup completed!")
print("📋 Final table list:")
final_tables = list(_connection.tables.all())
for table in final_tables:
    print(f"  - {table.name}: {table.table_status}")

print("🔍 Verifying table schemas...")
for table_name in ['Workouts', 'WorkoutInputs']:
    table = _connection.Table(table_name)
    print(f"  - {table_name}:")
    print(f"    Keys: {[k['AttributeName'] + '(' + k['KeyType'] + ')' for k in table.key_schema]}")
    print(f"    Status: {table.table_status}")
