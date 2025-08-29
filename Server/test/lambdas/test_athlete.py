import json
from lambdas.athlete.update_athlete_profile.update_athlete_profile import update_athlete_profile
from rds import execute_file
import pytest
from data import TestData
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.athlete.get_coaches.get_coaches import get_coaches
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.get_coach_requests.get_coach_requests import get_coach_requests
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from rds import fetch_one


@pytest.fixture(autouse=True)
def setup_before_each_test():
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    yield

def test_create_athlete():
    #Send a valid JSON event
    response = create_athlete(TestData.test_athlete, {})
    assert response['statusCode'] == 200

def test_get_coaches():
    create_athlete(TestData.test_athlete, {})
    create_coach(TestData.test_coach, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_invite, {})

    event = {
        "queryStringParameters": {
            "userId": '1234'
        }
    }
    response = get_coaches(event,{})
    assert response['statusCode'] == 200

    coaches = json.loads(response['body'])
    assert len(coaches) == 1
    assert coaches[0][0] == '123'
    assert coaches[0][1] == 'testcoach'

def test_get_coach_requests():
    create_athlete(TestData.test_athlete, {})
    create_coach(TestData.test_coach, {})
    invite_athlete(TestData.test_invite, {})

    event = {
        "queryStringParameters": {
            "userId": '1234'
        }
    }
   
    response = get_coach_requests(event, {})
    assert response['statusCode'] == 200

    coach_requests = json.loads(response['body'])
    assert len(coach_requests) == 1
    assert coach_requests[0][0] == '123'
    assert coach_requests[0][1] == 'testcoach'

def test_update_athlete_profile():
    create_athlete(TestData.test_athlete, {})
    event = {
        "body": json.dumps({
            "athleteId": '1234',
            "bio": "Updated bio",
            "firstName": "Updated",
            "lastName": "Name",
            "tffrsUrl": "http://updated.url",
            "gender": "Non-binary",
            "profilePictureUrl": None,
            'dateOfBirth': '2000-01-01',
            'weight': 70
        })
    }
    response = update_athlete_profile(event, {})
    assert response['statusCode'] == 200
    data = fetch_one("SELECT * FROM athletes WHERE userId = %s", ('1234',))
    assert data
    assert data[2] == "Updated bio"
    assert data[3] == "Updated"
    assert data[4] == "Name"
    assert data[5] == "http://updated.url"
    assert data[6] == "Non-binary"
    assert data[7] is None
    assert data[8] == '2000-01-01'
    assert data[9] == 70