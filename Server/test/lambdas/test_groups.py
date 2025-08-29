import json
import pytest
from lambdas.athlete.input_times.input_times import input_times
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.general.get_athletes_for_group.get_athletes_for_group import get_athletes_for_group
from lambdas.general.get_groups.get_groups import get_groups
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.coach.add_athlete_to_group.add_athlete_to_group import add_athlete_to_group
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.general.view_group_inputs.view_group_inputs import view_group_inputs
from rds import execute_file
from data import TestData

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    create_group(TestData.test_group, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    add_athlete_to_group(TestData.test_add_athlete_to_group, {})
    yield

def test_get_groups_athlete():
    response = get_groups(TestData.test_get_group_athlete, {})
    assert response['statusCode'] == 200

    groups = json.loads(response['body'])
    assert len(groups) == 1
    assert groups[0][0] == 'Test Group'
    assert groups[0][1] == 1

def test_get_groups_coach():
    create_group({
        "body": json.dumps({
            "groupName": "Test Group 2",
            "coachId": "123"
        })
    }, {})
    response = get_groups(TestData.test_get_group_coach, {})
    assert response['statusCode'] == 200

    groups = json.loads(response['body'])
    assert len(groups) == 2
    assert groups[0][0] == 'Test Group'
    assert groups[0][1] == 1
    assert groups[1][0] == 'Test Group 2'
    assert groups[1][1] == 2

def test_get_athletes_for_group():
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

    event = {
        "queryStringParameters": {
            "groupId": "1"
        }
    }

    response = get_athletes_for_group(event, {})
    assert response['statusCode'] == 200

    body = json.loads(response['body'])
    assert len(body) == 1

    assert body[0][0] == "1234"
    assert body[0][1] == "test_athlete"

def test_view_group_inputs():
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    input_times(TestData.test_input_times, {})
    event = {
        "queryStringParameters": {
            "groupId": 1
        }
    }
    response = view_group_inputs(event, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    assert len(data) == 1
    inputed_times = data['1234']
    assert len(inputed_times) == 2
    assert inputed_times[0]['distance'] == 100
    assert inputed_times[0]['time'] == 10.8
    assert inputed_times[1]['distance'] == 200
    assert inputed_times[1]['time'] == 30