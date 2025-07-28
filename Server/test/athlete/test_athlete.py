import sys
import os
import boto3
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from Server.lambdas.athlete.create_athlete.create_athlete import create_athlete

def test_create_athlete():
    event = json.load(open('events/create_athlete.json'))
    response = create_athlete(event, {})
    assert response['statusCode'] == 200

    # Test that the athlete was created
    dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')
    table = dynamodb.Table('athletes')
    response = table.get_item(Key={'username': 'john.doe'})
    assert response['Item'] == event