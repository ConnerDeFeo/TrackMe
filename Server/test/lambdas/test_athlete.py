import json
from lambdas.athlete.request_coach.request_coach import request_coach
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
from lambdas.athlete.view_coach_invites.view_coach_invites import view_coach_invites
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
    response = update_athlete_profile(TestData.test_update_athlete_profile, {})
    assert response['statusCode'] == 200
    data = fetch_one("SELECT * FROM athletes WHERE userId = %s", ('1234',))
    assert data
    assert data[2] == "Updated bio"
    assert data[3] == "Updated"
    assert data[4] == "Name"
    assert data[5] == "Male"
    assert data[6] is None
    assert data[7] == 70 

def test_request_coach():
    create_athlete(TestData.test_athlete, {})
    create_coach(TestData.test_coach, {})
    event = {
        "body": json.dumps({
            "athleteId": "1234",
            "coachId": "123"
        })
    }
    response = request_coach(event, {})
    assert response['statusCode'] == 200

    data = fetch_one("SELECT * FROM athlete_coach_requests WHERE athleteId = %s AND coachId = %s", ('1234', '123'))
    assert data is not None
    assert data[1] == '1234'
    assert data[2] == '123'

def test_view_coach_invites():
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    event = {
        'body': json.dumps({
            'userId': '1234'
        })
    }

    response = view_coach_invites(event, {})
    assert response['statusCode'] == 200

    invites = json.loads(response['body'])
    assert len(invites) == 1
    print(invites)
    assert invites[0][0] == 'testcoach'

def test_accept_coach_invite():
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    event = {
        'body': json.dumps({
            'athleteId': '1234',
            'coachId': '123'
        })
    }

    response = accept_coach_invite(event, {})
    assert response['statusCode'] == 200

    data = fetch_one("SELECT * FROM athlete_coaches WHERE athleteId = %s AND coachId = %s", ('1234', '123'))
    assert data is not None
    assert data[1] == '1234'
    assert data[2] == '123'
