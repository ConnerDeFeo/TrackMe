import boto3
import os
import json
import logging
from dotenv import load_dotenv

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

load_dotenv()


def create_athlete(event, context):
    try:
        logger.info(f"Received event: {json.dumps(event)}")
        
        # Get DynamoDB endpoint URL
        dynamodb_endpoint = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:8000")
        logger.info(f"Connecting to DynamoDB at: {dynamodb_endpoint}")
        
        # Connect to DynamoDB
        dynamodb = boto3.resource(
            "dynamodb",
            endpoint_url=dynamodb_endpoint,
            aws_access_key_id="dummy",
            aws_secret_access_key="dummy",
            region_name="us-east-2"
        )
        
        # Get table
        table_name = 'athletes'
        logger.info(f"Accessing table: {table_name}")
        table = dynamodb.Table(table_name)
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'email', 'password', 'username']
        for field in required_fields:
            if field not in event:
                return {
                    "statusCode": 400,
                    "headers": {"Content-Type": "application/json"},
                    "body": json.dumps({"error": f"Missing required field: {field}"})
                }
        
        # Create athlete
        item = {
            'first_name': event['first_name'],
            'last_name': event['last_name'],
            'email': event['email'],
            'password': event['password'],
            'username': event['username']
        }
        
        logger.info(f"Creating athlete with data: {json.dumps(item, default=str)}")
        table.put_item(Item=item)
        
        logger.info("Athlete created successfully")
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": "Athlete created successfully"})
        }
        
    except Exception as e:
        logger.error(f"Error creating athlete: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": f"Internal server error: {str(e)}"})
        }