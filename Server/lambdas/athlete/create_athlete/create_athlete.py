import boto3
import os


def create_athlete(event, context):
    dynamodb = boto3.resource(
        'dynamodb',
        os.getenv('DYNAMODB_ENDPOINT_URL')
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
        "statusCode": 200,
        "body": "Injected into dynamodb successfully"
    }