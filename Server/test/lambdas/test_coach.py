import json

import pytest
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.get_coach.get_coach import get_coach;
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.coach.get_athletes.get_athletes import get_athletes
from rds import execute_file
from data import TestData

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    yield

def test_create_coach():
    #Send a valid JSON event
    
    response = create_coach(TestData.test_coach, {})
    assert response['statusCode'] == 200

def test_get_coach():
    # Send a valid event to get a coach
    create_coach(TestData.test_coach, {})
    event = {
        "pathParameters": {
            "userId": "123"
        }
    }
    response = get_coach(event, {})
    assert response['statusCode'] == 200

    coach = json.loads(response['body'])
    assert '123' in coach
    assert 'testcoach' in coach

def test_get_athletes():
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})

    event = {
        "queryStringParameters": {
            "coachId": "123"
        }
    }
    response = get_athletes(event, {})
    assert response['statusCode'] == 200

    athletes = json.loads(response['body'])
    assert len(athletes) == 1
    assert athletes[0][0] == '1234'
    assert athletes[0][1] == 'test_athlete'