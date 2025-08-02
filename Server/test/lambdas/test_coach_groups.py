import pytest

from lambdas.athlete.accept_group_invite.accept_group_invite import accept_group_invite
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.general.get_group.get_group import get_group
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.coach.search_athlete.search_athlete import search_athlete
import json
from rds import execute_file, execute


@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    yield

test_coach = {
        "body": json.dumps({
            "userId": "123",
            'username': "testcoach",
        })
    }
test_group = {
        "body": json.dumps({
            "groupName": "Test Group",
            "userId": "123"
        })
    }
test_athlete_invite = {
    "body": json.dumps({
        "athleteId": "1234",
        "groupId": "1"
    })
}
test_accept_invite = {
    "body": json.dumps({
        "athleteId": "1234",
        "groupId": "1"
    })
}

def generate_athlete(username, userId):
    create_athlete( {
        "body": json.dumps({
            "userId": userId,
            "username": username
        })
    },{})

def test_create_group():
    create_coach(test_coach, {})
    response = create_group(test_group, {})
    assert response['statusCode'] == 200

def test_get_group():
    create_coach(test_coach, {})
    create_group(test_group, {})
    response = get_group(test_group, {})
    assert response['statusCode'] == 404 #no athletes in group yet

    execute("INSERT INTO athletes (userId, username) VALUES (%s, %s)", ("1234", "test_athlete"))
    execute("INSERT INTO athlete_groups (athleteId, groupId) VALUES (%s, %s)", ("1234", 1))

    response = get_group(test_group, {})
    assert response['statusCode'] == 200

    group_data = json.loads(response['body'])
    assert len(group_data) == 1
    assert "test_athlete" in group_data[0]

def test_invite_athlete():
    create_coach(test_coach, {})
    create_group(test_group, {})
    generate_athlete("test_athlete", "1234")
    event = {
        "body": json.dumps({
            "athleteId": "1234",
            "groupId": "1"
        })
    }
    response = invite_athlete(event, {})
    assert response['statusCode'] == 200

def test_search_athlete_for_group():
    create_coach(test_coach, {})
    create_group(test_group, {})
    generate_athlete("test_athlete", "1234")
    generate_athlete("test", "1235")
    generate_athlete("athlete_test", "1236")
    generate_athlete("something", "1237")
    event = {
        "body": json.dumps({
            "searchTerm": ""
        })
    }
    response = search_athlete(event, {})
    assert response['statusCode'] == 200
    athletes = json.loads(response['body'])
    assert len(athletes) == 4  # All athletes should be returned

    event['body'] = json.dumps({
        "searchTerm": "test"
    })
    response = search_athlete(event, {})
    assert response['statusCode'] == 200
    athletes = json.loads(response['body'])
    assert len(athletes) == 3  # onlyt test athletes should be returned

    event['body'] = json.dumps({
        "searchTerm": "ciderapple"
    })
    response = search_athlete(event, {})
    assert response['statusCode'] == 404  # No athletes should be returned, because no athletes match the search term