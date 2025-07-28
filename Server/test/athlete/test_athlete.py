import sys
import os
import boto3
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from Server.lambdas.athlete.create_athlete.create_athlete import create_athlete
"""
DYNAMODB DOCKER CONTAINER MUST BE RUNNING AND THE TABLE MUST BE CREATED
docker compose up -d
python setup_dynamodb.py
"""


def test_create_athlete():
    event = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "username": "john.doe",
        "password": "password"
    }
    response = create_athlete(event, {})
    assert response['statusCode'] == 200

    # Test that the athlete was created
    dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')
    table = dynamodb.Table('athletes')
    response = table.get_item(Key={'username': 'john.doe'})
    assert response['Item'] == event