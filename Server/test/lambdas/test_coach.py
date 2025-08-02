import datetime
import json
from Server.lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.get_group.get_group import get_group
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

    coach = json.loads(response['body'])
    assert 'userId' in coach
    assert coach['userId'] == "123"

def test_create_group():
    event = {
        "body": json.dumps({
            "groupName": "Test Group",
            "userId": "123"
        })
    }
    response = create_group(event, {})
    assert response['statusCode'] == 200

def test_get_group():
    event = {
        "body": json.dumps({
            "groupName": "Test Group",
            "userId": "123"
        })
    }
    response = get_group(event, {})
    assert response['statusCode'] == 200

    group = json.loads(response['body'])

    currdate = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
    assert 'createdAt' in group
    assert group['createdAt'] == currdate
    assert 'date' in group
    assert group['date'] == {currdate: {}}

#Clean up coach
delete_item('coaches', {'userId': '123'})