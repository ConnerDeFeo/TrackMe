import json

import pytest
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.accept_athlete_request.accept_athlete_request import accept_athlete_request
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.coach.get_athletes.get_athletes import get_athletes
from lambdas.coach.search_athletes.search_athletes import search_athletes
from lambdas.coach.update_coach_profile.update_coach_profile import update_coach_profile
from lambdas.coach.accept_athlete_request.accept_athlete_request import accept_athlete_request
from lambdas.athlete.request_coach.request_coach import request_coach
from lambdas.coach.view_athlete_requests.view_athlete_requests import view_athlete_requests
from lambdas.coach.decline_athlete_request.decline_athlete_request import decline_athlete_request
from rds import execute_file, fetch_one
from data import TestData

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('./setup.sql')
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

    #Check if coach exists in rds
    coach = fetch_one("SELECT * FROM coaches WHERE userId=%s", ('123',))
    assert coach is not None
    assert coach[0] == '123'
    assert coach[1] == 'testcoach'

def test_get_athletes():
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    
    # Debug: Check how many athletes exist after creating one
    from rds import fetch_all
    athletes_after_create = fetch_all("SELECT userId, username FROM athletes", ())
    print(f"Athletes after create_athlete: {athletes_after_create}")
    
    invite_athlete(TestData.test_invite, {})
    
    # Debug: Check again after invite
    athletes_after_invite = fetch_all("SELECT userId, username FROM athletes", ())
    print(f"Athletes after invite_athlete: {athletes_after_invite}")
    
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    
    # Debug: Check again after accept
    athletes_after_accept = fetch_all("SELECT userId, username FROM athletes", ())
    print(f"Athletes after accept_coach_invite: {athletes_after_accept}")
    
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

    # Added athlete
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})

    #Invited Athlete
    generate_athlete("testathlete2", "5678")
    invite_athlete({
        "body": json.dumps({
            "coachId": "123",
            "athleteId": "5678"
        })
    }, {})

    #Athlete Requested
    generate_athlete("testRequestAthlete", "1000")
    request_coach({
        "body": json.dumps({
            "coachId": "123",
            "athleteId": "1000"
        })
    }, {})

    #Neither
    generate_athlete("2test_athlete3", "91011")

    event = {
        "queryStringParameters": {
            "coachId": "123"
        }
    }
    response = search_athletes(event, {})
    assert response['statusCode'] == 200

    athletes = json.loads(response['body'])
    print(athletes)
    mappings = {'test_athlete':'Added', 'testathlete2':'Pending', 'testRequestAthlete':'Requested', '2test_athlete3':'Not Added'}
    assert len(athletes) == 4
    for athlete in athletes:
        assert athlete[2] == mappings[athlete[0]]

def test_search_with_term_athletes():
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

def test_update_athlete_profile():
    create_coach(TestData.test_coach, {})
    response = update_coach_profile(TestData.test_update_coach_profile, {})
    assert response['statusCode'] == 200
    data = fetch_one("SELECT * FROM coaches WHERE userId = %s", ('123',))
    assert data
    assert data[2] == "Updated bio"
    assert data[3] == "Updated"
    assert data[4] == "Name"
    assert data[5] == "Female"

def test_view_athlete_requests():
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    request_coach(TestData.test_invite, {})
    event = {
        'queryStringParameters': {
            'userId': '123'
        }
    }

    response = view_athlete_requests(event, {})
    assert response['statusCode'] == 200

    requests = json.loads(response['body'])
    assert len(requests) == 1
    assert requests[0][0] == '1234'
    assert requests[0][1] == 'test_athlete'

def test_accept_athlete_request():
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    request_coach(TestData.test_invite, {})
    event = {
        'body': json.dumps({
            'athleteId': '1234',
            'coachId': '123'
        })
    }

    response = accept_athlete_request(event, {})
    assert response['statusCode'] == 200

    data = fetch_one("SELECT * FROM athlete_coaches WHERE athleteId = %s AND coachId = %s", ('1234', '123'))
    assert data is not None
    assert data[1] == '1234'
    assert data[2] == '123'

def test_decline_athlete_request():
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    request_coach(TestData.test_invite, {})
    event = {
        'queryStringParameters': {
            'athleteId': '1234',
            'coachId': '123'
        }
    }
    response = decline_athlete_request(event, {})
    assert response['statusCode'] == 200

    data = fetch_one("SELECT * FROM athlete_coach_requests WHERE athleteId = %s AND coachId = %s", ('1234', '123'))
    assert data is None