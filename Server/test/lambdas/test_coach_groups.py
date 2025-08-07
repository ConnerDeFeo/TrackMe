import pytest

from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
import json
from data import TestData
from rds import execute_file, fetch_one


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
