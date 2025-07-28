import boto3
import os
from dotenv import load_dotenv
load_dotenv()


def create_athlete(event, context):
    dynamodb = boto3.resource(
        'dynamodb',
        endpoint_url=os.getenv("DYNAMODB_ENDPOINT_URL"),
        aws_access_key_id="dummy",
        aws_secret_access_key="dummy",
        region_name="us-east-2"
    )
    table = dynamodb.Table('athletes')
    table.put_item(
        Item={
            'first_name': event['first_name'],
            'last_name': event['last_name'],
            'email': event['email'],
            'password': event['password'],
            'username': event['username']
        }
    )
    return {
        "statusCode": 200
    }