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
from lambdas.athlete.get_coach_invites.get_coach_invites import get_coach_invites
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.athlete.view_coach_invites.view_coach_invites import view_coach_invites
from lambdas.athlete.search_coaches.search_coaches import search_coaches
from lambdas.athlete.decline_coach_invite.decline_coach_invite import decline_coach_invite
from rds import fetch_one
from testing_utils import generate_auth_header


@pytest.fixture(autouse=True)
def setup_before_each_test():
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    yield

def generate_coach(username, userId):
    create_coach( {
        "headers":generate_auth_header(userId, "Coach", username)
    },{})

def setup_get_coaches():
    """Set up a coach-athlete relationship for testing."""
    create_athlete(TestData.test_athlete, {})
    create_coach(TestData.test_coach, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    event = {
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }
    return event

def setup_coach_invite():
    """Set up a coach invite for an athlete."""
    create_athlete(TestData.test_athlete, {})
    create_coach(TestData.test_coach, {})
    invite_athlete(TestData.test_invite, {})
    event = {
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }
    return event

def setup_search_coaches_scenario():
    """Set up a complex scenario with multiple coaches and relationship statuses."""
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})

    # 1. Added Coach
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})

    # 2. Invited Coach
    generate_coach("testInviteCoach2", "5678")
    invite_athlete({
        "body": json.dumps({"athleteId": "1234"}),
        "headers": generate_auth_header("5678", "Coach", "testInviteCoach2")
    }, {})

    # 3. Requested Coach
    generate_coach("testRequestCoach", "1000")
    request_coach({
        "body": json.dumps({"coachId": "1000"}),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }, {})

    # 4. Unrelated Coach
    generate_coach("2test_coach3", "91011")

def test_create_athlete_returns_success():
    # Arrange
    event = TestData.test_athlete

    # Act
    response = create_athlete(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_get_coaches_returns_success():
    # Arrange
    event = setup_get_coaches()

    # Act
    response = get_coaches(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_get_coaches_returns_correct_coaches():
    # Arrange
    event = setup_get_coaches()

    # Act
    response = get_coaches(event, {})

    # Assert
    coaches = json.loads(response['body'])
    assert len(coaches) == 1
    assert '123' in coaches[0]
    assert 'testcoach' in coaches[0]

def test_get_coach_invites_returns_success():
    # Arrange
    event = setup_coach_invite()
   
    # Act
    response = get_coach_invites(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_get_coach_invites_returns_correct_invites():
    # Arrange
    event = setup_coach_invite()
   
    # Act
    response = get_coach_invites(event, {})

    # Assert
    coach_requests = json.loads(response['body'])
    assert len(coach_requests) == 1
    assert coach_requests[0] == ['123', 'testcoach']

def test_update_athlete_profile_returns_success():
    # Arrange
    create_athlete(TestData.test_athlete, {})
    event = TestData.test_update_athlete_profile

    # Act
    response = update_athlete_profile(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_update_athlete_profile_persists_changes():
    # Arrange
    create_athlete(TestData.test_athlete, {})
    event = TestData.test_update_athlete_profile

    # Act
    update_athlete_profile(event, {})

    # Assert
    data = fetch_one("SELECT * FROM athletes WHERE userId = %s", ('1234',))
    assert data
    assert data[2] == "Updated bio"
    assert data[3] == "Updated"
    assert data[4] == "Name"
    assert data[5] == "Male"
    assert data[6] is None
    assert data[7] == 70 

def test_request_coach_returns_success():
    # Arrange
    create_athlete(TestData.test_athlete, {})
    create_coach(TestData.test_coach, {})
    event = {
        "body": json.dumps({"coachId": "123"}),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = request_coach(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_request_coach_creates_request_in_db():
    # Arrange
    create_athlete(TestData.test_athlete, {})
    create_coach(TestData.test_coach, {})
    event = {
        "body": json.dumps({"coachId": "123"}),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    request_coach(event, {})

    # Assert
    data = fetch_one("SELECT * FROM athlete_coach_requests WHERE athleteId = %s AND coachId = %s", ('1234', '123'))
    assert data is not None
    assert data[1] == '1234'
    assert data[2] == '123'

def test_view_coach_invites_returns_success():
    # Arrange
    event = setup_coach_invite()

    # Act
    response = view_coach_invites(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_view_coach_invites_returns_correct_invites():
    # Arrange
    event = setup_coach_invite()

    # Act
    response = view_coach_invites(event, {})

    # Assert
    invites = json.loads(response['body'])
    assert len(invites) == 1
    assert invites[0][0] == 'testcoach'

def test_accept_coach_invite_returns_success():
    # Arrange
    setup_coach_invite()
    event = {
        'body': json.dumps({'coachId': '123'}),
        'headers': generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = accept_coach_invite(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_accept_coach_invite_creates_relationship():
    # Arrange
    setup_coach_invite()
    event = {
        'body': json.dumps({'coachId': '123'}),
        'headers': generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    accept_coach_invite(event, {})

    # Assert
    data = fetch_one("SELECT * FROM athlete_coaches WHERE athleteId = %s AND coachId = %s", ('1234', '123'))
    assert data is not None
    assert data[1] == '1234'
    assert data[2] == '123'

def test_search_coaches_no_term_returns_all_coaches_with_status():
    # Arrange
    setup_search_coaches_scenario()
    event = {
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }
    
    # Act
    response = search_coaches(event, {})
    
    # Assert
    assert response['statusCode'] == 200
    coaches = json.loads(response['body'])
    assert len(coaches) == 4
    
    expected_statuses = {'testcoach': 'Added', 'testInviteCoach2': 'Invited', 'testRequestCoach': 'Pending', '2test_coach3': 'Not Added'}
    for coach in coaches:
        assert coach[2] == expected_statuses[coach[0]]

def test_search_coaches_with_term_returns_filtered_coaches():
    # Arrange
    setup_search_coaches_scenario()
    event = {
        "queryStringParameters": {'searchTerm': 'test'},
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = search_coaches(event, {})

    # Assert
    assert response['statusCode'] == 200
    coaches = json.loads(response['body'])
    assert len(coaches) == 3 # testcoach, testInviteCoach2, testRequestCoach
    
    coach_names = [c[0] for c in coaches]
    assert 'testcoach' in coach_names
    assert 'testInviteCoach2' in coach_names
    assert 'testRequestCoach' in coach_names
    assert '2test_coach3' not in coach_names

def test_decline_coach_invite_returns_success():
    # Arrange
    setup_coach_invite()
    event = {
        'queryStringParameters': {'coachId': '123'},
        'headers': generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = decline_coach_invite(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_decline_coach_invite_removes_invite():
    # Arrange
    setup_coach_invite()
    event = {
        'queryStringParameters': {'coachId': '123'},
        'headers': generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    decline_coach_invite(event, {})

    # Assert
    data = fetch_one("SELECT * FROM athlete_coach_invites WHERE athleteId = %s AND coachId = %s", ('1234', '123'))
    assert data is None