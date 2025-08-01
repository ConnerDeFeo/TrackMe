import json
from Server.layers.common.python.dynamodb_client import delete_item
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.athlete.get_athlete.get_athlete import get_athlete

def test_create_athlete():
    #Send a valid JSON event
    event = {
        "body": json.dumps({
            "userId": "123",
        })
    }
    response = create_athlete(event, {})
    assert response['statusCode'] == 200

def test_get_athlete():
    # Send a valid event to get an athlete
    event = {
        "pathParameters": {
            "userId": "123"
        }
    }
    response = get_athlete(event, {})
    assert response['statusCode'] == 200

#Clean up athlete
delete_item('athletes', {'userId': '123'})