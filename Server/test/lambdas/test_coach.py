import json

import pytest
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.get_coach.get_coach import get_coach;
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.coach.get_athletes.get_athletes import get_athletes
from lambdas.coach.search_athletes.search_athletes import search_athletes
from rds import execute_file
from data import TestData

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    yield

def generate_athlete(username, userId):
    create_athlete( {
        "body": json.dumps({
            "userId": userId,
            "username": username
        })
    },{})

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

def test_search_empty_athletes():
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    generate_athlete("testathlete2", "5678")
    generate_athlete("2test_athlete3", "91011")
    invite_athlete({
        "body": json.dumps({
            "coachId": "123",
            "athleteId": "5678"
        })
    }, {})

    event = {
        "queryStringParameters": {
            "coachId": "123"
        }
    }
    response = search_athletes(event, {})
    assert response['statusCode'] == 200

    athletes = json.loads(response['body'])
    for athlete in athletes:
        assert athlete[0] in ['test_athlete', 'testathlete2', '2test_athlete3']
        assert athlete[1] in ['1234', '5678', '91011']
        assert athlete[2] in ['Added', 'Pending', 'Not Added']

def test_seach_with_term_athletes():
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    generate_athlete("testathlete2", "5678")
    generate_athlete("2test_athlete3", "91011")
    invite_athlete({
        "body": json.dumps({
            "coachId": "123",
            "athleteId": "5678"
        })
    }, {})

    event = {
        "queryStringParameters": {
            "coachId": "123",
            'searchTerm': 'test'
        }
    }
    response = search_athletes(event, {})
    assert response['statusCode'] == 200
    athletes = json.loads(response['body'])
    assert len(athletes) == 2
    assert athletes[0][0] == 'test_athlete'
    assert athletes[0][1] == '1234'
    assert athletes[0][2] == 'Added'
    assert athletes[1][0] == 'testathlete2'
    assert athletes[1][1] == '5678'
    assert athletes[1][2] == 'Pending'
