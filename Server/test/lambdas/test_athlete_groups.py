import pytest

from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.general.get_group.get_group import get_group
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.accept_group_invite.accept_group_invite import accept_group_invite
import json
from rds import execute_file


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
test_invite = {
    "body": json.dumps({
        "athleteId": "1234",
        "groupId": "1"
    })
}

def test_accept_group_invite():
    create_coach(test_coach, {})
    create_group(test_group, {})
    create_athlete(test_athlete, {})
    invite_athlete(test_invite, {})
    event = {
        "body": json.dumps({
            "athleteId": "1234",
            "groupId": "1"
        })
    }
    response = accept_group_invite(event, {})
    assert response['statusCode'] == 200

    #Check if athlete is actually added to group
    response = get_group(test_group, {})
    assert response['statusCode'] == 200
    group = json.loads(response['body'])
    assert len(group) == 1
    assert 'test_athlete' == group[0][0]


