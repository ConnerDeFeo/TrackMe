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
from rds import execute_file, fetch_one, fetch_all
from testing_utils import *
from data import TestData

def setup_coach_and_athlete():
    """Helper function to create a standard coach and athlete for tests."""
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})

def setup_athlete_request_scenario():
    """Helper function to set up a scenario where an athlete has requested a coach."""
    setup_coach_and_athlete()
    request_coach(TestData.test_request_coach, {})

def setup_coach_invite_scenario():
    """Helper function to set up a scenario where a coach has invited an athlete."""
    setup_coach_and_athlete()
    invite_athlete(TestData.test_invite, {})

def setup_accepted_relationship_scenario():
    """Helper function to set up a scenario where a coach and athlete have an established relationship."""
    setup_coach_invite_scenario()
    accept_coach_invite(TestData.test_accept_coach_invite, {})

def setup_multi_status_athletes_scenario():
    """Helper function to set up athletes with various relationship statuses to a coach."""
    # Coach
    create_coach(TestData.test_coach, {})

    # Athlete 1: Added
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})

    # Athlete 2: Invited (Pending)
    generate_athlete("testathlete2", "5678")
    invite_athlete({
        "body": json.dumps({"athleteId": "5678"}),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})

    # Athlete 3: Requested
    generate_athlete("testRequestAthlete", "1000")
    request_coach({
        "body": json.dumps({"coachId": "123"}),
        "headers": generate_auth_header("1000", "Athlete", "testRequestAthlete")
    }, {})

    # Athlete 4: Not Added
    generate_athlete("2test_athlete3", "91011")


@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    yield

def generate_athlete(username, user_id):
    create_athlete( {
        "headers":generate_auth_header(user_id, "Athlete", username)
    },{})

def test_create_coach_success():
    # Arrange
    event = TestData.test_coach

    # Act
    response = create_coach(event, {})
    
    # Assert
    assert response['statusCode'] == 200
    coach = fetch_one("SELECT userId, username FROM coaches WHERE userId=%s", ('123',))
    assert coach is not None
    assert coach[0] == '123'
    assert coach[1] == 'testcoach'

def test_get_athletes_returns_accepted_athlete():
    # Arrange
    setup_accepted_relationship_scenario()
    event = {
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_athletes(event, {})

    # Assert
    assert response['statusCode'] == 200
    athletes = json.loads(response['body'])
    assert len(athletes) == 1
    assert athletes[0][0] == '1234'
    assert athletes[0][1] == 'test_athlete'

def test_get_athletes_returns_empty_list_for_no_athletes():
    # Arrange
    create_coach(TestData.test_coach, {})
    event = {
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_athletes(event, {})

    # Assert
    assert response['statusCode'] == 404

def test_search_athletes_no_term_returns_all_with_status():
    # Arrange
    setup_multi_status_athletes_scenario()
    event = {
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }
    
    # Act
    response = search_athletes(event, {})

    # Assert
    assert response['statusCode'] == 200
    athletes = json.loads(response['body'])
    
    expected_statuses = {
        'test_athlete': 'Added', 
        'testathlete2': 'Pending', 
        'testRequestAthlete': 'Requested', 
        '2test_athlete3': 'Not Added'
    }
    assert len(athletes) == 4
    
    for athlete in athletes:
        assert athlete[2] == expected_statuses[athlete[0]]

def test_search_athletes_with_term_returns_matching_athletes():
    # Arrange
    setup_multi_status_athletes_scenario()
    event = {
        "queryStringParameters": {'searchTerm': 'test'},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = search_athletes(event, {})

    # Assert
    assert response['statusCode'] == 200
    athletes = json.loads(response['body'])
    
    assert len(athletes) == 3 # test_athlete, testathlete2, testRequestAthlete
    
    usernames = {athlete[0] for athlete in athletes}
    assert 'test_athlete' in usernames
    assert 'testathlete2' in usernames
    assert 'testRequestAthlete' in usernames
    assert '2test_athlete3' not in usernames

def test_update_coach_profile_success():
    # Arrange
    create_coach(TestData.test_coach, {})
    event = TestData.test_update_coach_profile

    # Act
    response = update_coach_profile(event, {})

    # Assert
    assert response['statusCode'] == 200

    updated_coach = fetch_one("SELECT bio, firstName, lastName, gender, profilePictureUrl FROM coaches WHERE userId = %s", ('123',))
    assert updated_coach is not None
    assert updated_coach[0] == "Updated bio"
    assert updated_coach[1] == "Updated"
    assert updated_coach[2] == "Name"
    assert updated_coach[3] == "Female"
    assert updated_coach[4] is None

def test_view_athlete_requests_success():
    # Arrange
    setup_athlete_request_scenario()
    event = {
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = view_athlete_requests(event, {})

    # Assert
    assert response['statusCode'] == 200
    requests = json.loads(response['body'])
    assert len(requests) == 1
    assert requests[0][0] == '1234'
    assert requests[0][1] == 'test_athlete'

def test_accept_athlete_request_success():
    # Arrange
    setup_athlete_request_scenario()
    event = {
        'body': json.dumps({'athleteId': '1234'}),
        'headers': generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = accept_athlete_request(event, {})

    # Assert
    assert response['statusCode'] == 200
    relationship = fetch_one("SELECT * FROM athlete_coaches WHERE athleteId = %s AND coachId = %s", ('1234', '123'))
    assert relationship is not None

def test_decline_athlete_request_success():
    # Arrange
    setup_athlete_request_scenario()
    event = {
        'queryStringParameters': {'athleteId': '1234'},
        'headers': generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = decline_athlete_request(event, {})

    # Assert
    assert response['statusCode'] == 200
    request_exists = fetch_one("SELECT * FROM athlete_coach_requests WHERE athleteId = %s AND coachId = %s", ('1234', '123'))
    assert request_exists is None