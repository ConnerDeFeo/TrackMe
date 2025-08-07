import pytest

from lambdas.athlete.accept_group_invite.accept_group_invite import accept_group_invite
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.coach.search_athlete_for_group.search_athlete_for_group import search_athlete_for_group
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
    generate_athlete("test_athlete", "1234")
    event = {
        "body": json.dumps({
            "athleteId": "1234",
            "groupId": "1"
        })
    }
    response = invite_athlete(event, {})
    assert response['statusCode'] == 200

    #Check if athlete is invited
    response =  fetch_one("""
        SELECT * FROM athlete_group_invites WHERE athleteId = %s AND groupId = %s
    """, ("1234", "1"))
    assert response is not None
    assert response[1] == "1234"
    assert response[0] == 1

def test_search_athlete_for_group():
    create_group(TestData.test_group, {})

    # Athletes that are part of group
    generate_athlete("test_athlete", "1234")
    invite_athlete(TestData.test_invite, {})
    accept_group_invite(TestData.test_accept_group_invite, {})

    # Athletes invited
    generate_athlete("test", "1235")
    invite_athlete({
        "body": json.dumps({
            "athleteId": "1235",
            "groupId": "1"
        })
    }, {})

    # Athletes not invited or part of group
    generate_athlete("athlete_test", "1236")
    generate_athlete("something", "1237")

    # Test searching athletes empty search term
    event = {
        "queryStringParameters": {
            "searchTerm": "",
            "groupId": "1"
        }
    }
    response = search_athlete_for_group(event, {})
    assert response['statusCode'] == 200
    athletes = json.loads(response['body'])
    assert len(athletes) == 4  # All athletes should be returned
    for athlete in athletes:
        if athlete[0] == "test_athlete":
            assert athlete[1] == "Joined"
        elif athlete[0] == "test":
            assert athlete[1] == "Invited"
        else:
            assert athlete[1] == "Not Invited"

    #Test with valid search term
    event['queryStringParameters'] = {
        "searchTerm": "test",
        "groupId": "1"
    }
    response = search_athlete_for_group(event, {})
    assert response['statusCode'] == 200
    athletes = json.loads(response['body'])
    assert len(athletes) == 3  # only test athletes should be returned

    #Test with invalid search term
    event['queryStringParameters'] = {
        "searchTerm": "ciderapple",
        "groupId": "1"
    }
    response = search_athlete_for_group(event, {})
    assert response['statusCode'] == 404  # No athletes should be returned, because no athletes match the search term