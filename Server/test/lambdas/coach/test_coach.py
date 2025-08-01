import json
from Server.layers.common.python.dynamodb_client import delete_item
from Server.lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.get_coach.get_coach import get_coach;


def test_create_coach():
    #Send a valid JSON event
    event = {
        "body": json.dumps({
            "userId": "123",
        })
    }
    
    response = create_coach(event, {})
    assert response['statusCode'] == 200

def test_get_coach():
    # Send a valid event to get a coach
    event = {
        "pathParameters": {
            "userId": "123"
        }
    }
    response = get_coach(event, {})
    assert response['statusCode'] == 200

#Clean up coach
delete_item('coaches', {'userId': '123'})

def test_create_group():
    event = {
        "body": json.dumps({
            "groupName": "Test Group",
            "userId": "123"
        })
    }
    response = create_group(event, {})
    assert response['statusCode'] == 200