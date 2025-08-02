import pytest

from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.get_group.get_group import get_group
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
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
test_athlete = {
        "body": json.dumps({
            "userId": "1234",
            "username": "test_athlete"
        })
    }

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
    create_athlete(test_athlete, {})
    event = {
        "body": json.dumps({
            "athleteId": "1234",
            "groupId": "1"
        })
    }
    response = invite_athlete(event, {})
    assert response['statusCode'] == 200