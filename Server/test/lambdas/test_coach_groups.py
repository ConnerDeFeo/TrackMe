import pytest

from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.coach.add_athlete_to_group.add_athlete_to_group import add_athlete_to_group
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.get_absent_group_athletes.get_absent_group_athletes import get_absent_group_athletes
from lambdas.general.get_athletes_for_group.get_athletes_for_group import get_athletes_for_group
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
import json
from data import TestData
from lambdas.coach.remove_group_athlete.remove_group_athlete import remove_group_athlete
from rds import execute_file, fetch_one
from testing_utils import debug_table


test_coach = {
        "body": json.dumps({
            "userId": "123",
            'username': "testcoach",
        })
    }

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    create_coach(test_coach, {})
    yield

def generate_athlete(username, userId):
    create_athlete( {
        "body": json.dumps({
            "userId": userId,
            "username": username
        })
    },{})

def test_create_group():
    response = create_group(TestData.test_group, {})
    assert response['statusCode'] == 200
    group_id = json.loads(response['body'])
    assert group_id['groupId'] == 1

def test_invite_athlete():
    create_group(TestData.test_group, {})
    create_athlete(TestData.test_athlete, {})
    response = invite_athlete(TestData.test_invite, {})
    assert response['statusCode'] == 200

    #Check if athlete is invited
    response =  fetch_one("""
        SELECT * FROM athlete_coach_invites WHERE athleteId = %s AND coachId = %s
    """, ("1234", "123"))
    assert response is not None
    assert response[1] == "1234"
    assert response[2] == '123'

def test_add_athlete_to_group():
    create_group(TestData.test_group, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})

    event = {
        "body": json.dumps({
            "athleteId": "1234",
            "coachId": "123",
            "groupId": "1"
        })
    }

    response = add_athlete_to_group(event, {})
    assert response['statusCode'] == 200

    # Check if athlete is added to group
    response = fetch_one("""
        SELECT * FROM athlete_groups WHERE athleteId = %s AND groupId = %s
    """, ("1234", "1"))
    assert response is not None
    assert response[0] == "1234"
    assert response[1] == 1

#Setups the following tests for getting group athletes
def setup_get_tests():
    create_group(TestData.test_group, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    add_athlete_to_group(TestData.test_add_athlete_to_group, {})
    create_athlete({
        "body": json.dumps({
            "userId": "1235",
            "username": "testathlete2"
        })
    }, {})
    invite_athlete({
        "body": json.dumps({
            "athleteId": "1235",
            "coachId": "123"
        })
    }, {})
    accept_coach_invite({
        "body": json.dumps({
            "athleteId": "1235",
            "coachId": "123"
        })
    }, {})

def test_get_absent_group_athletes():
    setup_get_tests()

    event = {
        "queryStringParameters": {
            "groupId": "1",
            "coachId": "123"
        }
    }

    response = get_absent_group_athletes(event, {})
    assert response['statusCode'] == 200

    body = json.loads(response['body'])
    assert len(body) == 1

    assert body[0][0] == "1235"
    assert body[0][1] == "testathlete2"

def test_remove_group_athlete():
    create_group(TestData.test_group, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    add_athlete_to_group(TestData.test_add_athlete_to_group, {})

    event = {
        "queryStringParameters": {
            "groupId": "1",
            "athleteId": "1234"
        }
    }

    response = remove_group_athlete(event, {})
    assert response['statusCode'] == 200

    # Check if athlete is removed from group
    event = {
        "queryStringParameters": {
            "groupId": "1"
        }
    }

    response = get_athletes_for_group(event, {})
    assert response['statusCode'] == 404

    event = {
        "queryStringParameters": {
            "groupId": "1",
            "coachId": "123"
        }
    }

    response = get_absent_group_athletes(event, {})
    assert response['statusCode'] == 200
    assert json.loads(response['body']) == [['1234', "test_athlete"]]