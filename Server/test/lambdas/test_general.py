import json
import pytest
from lambdas.athlete.input_times.input_times import input_times
from lambdas.coach.assign_group_workout.assign_group_workout import assign_group_workout
from lambdas.coach.assign_group_workout_template.assign_group_workout_template import assign_group_workout_template
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.delete_group.delete_group import delete_group
from lambdas.coach.update_coach_profile.update_coach_profile import update_coach_profile
from lambdas.general.get_athletes_for_group.get_athletes_for_group import get_athletes_for_group
from lambdas.general.get_group_workout.get_group_workout import get_group_workout
from lambdas.general.get_groups.get_groups import get_groups
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.coach.add_athlete_to_group.add_athlete_to_group import add_athlete_to_group
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.general.get_pending_proposals.get_pending_proposals import get_pending_proposals
from lambdas.general.get_user.get_user import get_user
from lambdas.general.remove_coach_athlete.remove_coach_athlete import remove_coach_athlete
from lambdas.general.view_group_inputs.view_group_inputs import view_group_inputs
from lambdas.coach.create_workout_template.create_workout_template import create_workout_template
from rds import execute_file, fetch_one, fetch_all
from data import TestData
from lambdas.athlete.update_athlete_profile.update_athlete_profile import update_athlete_profile
from lambdas.general.get_weekly_schedule.get_weekly_schedule import get_weekly_schedule
from lambdas.general.mass_input.mass_input import mass_input
from datetime import datetime, timedelta, timezone
from testing_utils import *

date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

# --- Helper Functions ---

def setup_base_scenario():
    """Sets up a standard coach, athlete, and their relationship."""
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})

def setup_group_scenario():
    """Sets up a group with a coach and one athlete."""
    setup_base_scenario()
    create_group(TestData.test_group, {})
    add_athlete_to_group(TestData.test_add_athlete_to_group, {})

def setup_get_weekly_schedule_scenario():
    five_days_ago = (datetime.now(timezone.utc) - timedelta(days=5)).strftime("%Y-%m-%d")
    six_days_ago = (datetime.now(timezone.utc) - timedelta(days=6)).strftime("%Y-%m-%d")
    # Arrange
    setup_group_scenario()
    # Create and assign a workout template
    create_workout_template(TestData.test_workout, {})
    assign_group_workout_template(TestData.test_assign_group_workout, {})
    assign_group_workout({
        "body": json.dumps({
            'title': 'Test Workout 2', 
            'description': 'This is a test workout 2',
            'sections': [
                {
                    'name': 'Test2',
                    'sets': 2,
                }
            ],
            'groupId': 1,
            'date': five_days_ago
        }),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }, {})
    assign_group_workout({
        "body": json.dumps({
            'title': 'Test Workout 3', 
            'description': 'This is a test workout 3',
            'sections': [
                {
                    'name': 'Test3',
                    'sets': 5,
                }
            ],
            'groupId': 1,
            'date': six_days_ago
        }),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }, {})
    assign_group_workout({
        "body": json.dumps({
            'title': 'Test Workout 4', 
            'description': 'This is a test workout 4',
            'sections': [
                {
                    'name': 'Test4',
                    'sets': 5,
                }
            ],
            'groupId': 1,
            'date': six_days_ago
        }),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }, {})

def generate_athlete(username, userId):
    """Generates a new athlete."""
    create_athlete({"headers": generate_auth_header(userId, "Athlete", username)}, {})

@pytest.fixture(autouse=True)
def setup_before_each_test():
    """This will run before each test, setting up a clean database."""
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    yield

# --- Test Cases ---

def test_get_groups_as_athlete():
    # Arrange
    setup_group_scenario()
    event = TestData.test_get_group_athlete

    # Act
    response = get_groups(event, {})

    # Assert
    assert response['statusCode'] == 200
    groups = json.loads(response['body'])
    assert len(groups) == 1
    assert groups[0] == ['Test Group', 1]

def test_get_groups_as_coach():
    # Arrange
    setup_group_scenario()
    # Create a second group for the coach
    create_group({
        "body": json.dumps({"groupName": "Test Group 2"}),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})
    event = TestData.test_get_group_coach

    # Act
    response = get_groups(event, {})

    # Assert
    assert response['statusCode'] == 200
    groups = json.loads(response['body'])
    assert len(groups) == 2
    assert groups[0] == ['Test Group', 1]
    assert groups[1] == ['Test Group 2', 2]

def test_get_groups_fails_after_group_deletion():
    # Arrange
    setup_group_scenario()
    delete_event = {
        "queryStringParameters": {"groupId": "1"},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }
    delete_group(delete_event, {})
    
    # Act
    response = get_groups(TestData.test_get_group_athlete, {})

    # Assert
    assert response['statusCode'] == 404

def test_get_athletes_for_group_success():
    # Arrange
    setup_group_scenario()
    # Add another athlete to the system who is NOT in the group
    generate_athlete("testathlete2", "1235")
    invite_athlete({"body": json.dumps({"athleteId": "1235"}), "headers": generate_auth_header("123", "Coach", "testcoach")}, {})
    accept_coach_invite({"body": json.dumps({"coachId": "123"}), "headers": generate_auth_header("1235", "Athlete", "testathlete2")}, {})
    
    event = {"queryStringParameters": {"groupId": "1"}}

    # Act
    response = get_athletes_for_group(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 1
    assert '1234' in body[0]
    assert 'test_athlete' in body[0]

def test_view_group_inputs_success():
    # Arrange
    setup_group_scenario()
    input_times(TestData.test_input_times, {})
    event = {"queryStringParameters": {"groupId": 1}}

    # Act
    response = view_group_inputs(event, {})

    # Assert
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    assert '1234' in data
    
    athlete_time_inputs = data['1234']
    assert len(athlete_time_inputs) == 3
    # Should be in correct insertion order
    assert athlete_time_inputs == [{'distance': 100, 'time': 10.8}, {'restTime': 5}, {'distance': 200, 'time': 30.0}]

def test_get_user_as_athlete():
    # Arrange
    setup_base_scenario()
    update_athlete_profile(TestData.test_update_athlete_profile, {})
    event = {"headers": generate_auth_header("1234", "Athlete", "test_athlete")}

    # Act
    response = get_user(event, {})

    # Assert
    assert response['statusCode'] == 200
    athlete_data = json.loads(response['body'])
    assert athlete_data['username'] == "test_athlete"
    assert athlete_data['bio'] == "Updated bio"
    assert athlete_data['firstName'] == "Updated"
    assert athlete_data['lastName'] == "Name"
    assert athlete_data['gender'] == "Male"
    assert athlete_data['bodyWeight'] == 70
    assert athlete_data['tffrsUrl'] == "someurl"

def test_get_user_as_coach():
    # Arrange
    setup_base_scenario()
    update_coach_profile(TestData.test_update_coach_profile, {})
    event = {"headers": generate_auth_header("123", "Coach", "testcoach")}

    # Act
    response = get_user(event, {})

    # Assert
    assert response['statusCode'] == 200
    coach_data = json.loads(response['body'])
    assert coach_data['username'] == "testcoach"
    assert coach_data['bio'] == "Updated bio"
    assert coach_data['firstName'] == "Updated"
    assert coach_data['lastName'] == "Name"
    assert coach_data['gender'] == "Female"

def test_remove_coach_athlete_relationship():
    # Arrange
    setup_base_scenario()
    event = {
        "queryStringParameters": {"coachId": "123", "athleteId": "1234"},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = remove_coach_athlete(event, {})

    # Assert
    assert response['statusCode'] == 200
    relationship = fetch_one("SELECT * FROM athlete_coaches WHERE coachId = %s AND athleteId = %s", ("123", "1234"))
    assert relationship is None

def test_get_group_workout_success():
    # Arrange
    setup_group_scenario()
    # Create and assign a workout template
    workout_response = create_workout_template(TestData.test_workout, {})
    workout_id = json.loads(workout_response['body'])['workout_id']
    assign_workout_event = {
        "body": json.dumps({"workoutId": workout_id, "groupId": "1"}),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }
    assign_group_workout_template(assign_workout_event, {})
    
    event = {
        "queryStringParameters": {"groupId": "1", "date": date},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_group_workout(event, {})

    # Assert
    assert response['statusCode'] == 200
    workout = json.loads(response['body'])[0]
    assert workout['title'] == 'Test Workout'
    assert workout['description'] == 'This is a test workout'
    assert len(workout['sections']) == 3

def test_get_pending_proposals_for_athlete():
    # Arrange
    create_coach(TestData.test_coach, {})
    generate_athlete("testathlete2", "1235")
    # Coach invites athlete
    invite_athlete({
        "body": json.dumps({"athleteId": "1235"}),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})
    
    event = {"headers": generate_auth_header("1235", "Athlete", "testathlete2")}

    # Act
    response = get_pending_proposals(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body["count"] == 1

def test_mass_input_success():
    # Arrange
    setup_group_scenario()
    # Add more athletes to the group
    generate_athlete("testathlete2", "5678")
    generate_athlete("testathlete3", "91011")
    for athlete_id in ["5678", "91011"]:
        invite_athlete({"body": json.dumps({"athleteId": athlete_id}), "headers": generate_auth_header("123", "Coach", "testcoach")}, {})
        accept_coach_invite({"body": json.dumps({"coachId": "123"}), "headers": generate_auth_header(athlete_id, "Athlete", f"athlete_{athlete_id}")}, {})
        add_athlete_to_group({"body": json.dumps({"groupId": 1, "athleteId": athlete_id}), "headers": generate_auth_header("123", "Coach", "testcoach")}, {})

    event = {
        "body": json.dumps({
            "groupId": 1,
            "athleteData": {
                "1234": [{"time": 12.5, "distance": 100}, {"time": 25.0, "distance": 200}],
                "5678": [{"time": 11.0, "distance": 100}, {"time": 22.0, "distance": 200}],
                "91011": [{"time": 10.5, "distance": 100}, {"time": 21.0, "distance": 200}]
            }
        }),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = mass_input(event, {})

    # Assert
    assert response['statusCode'] == 200
    all_inputs = fetch_all("SELECT athleteId, distance, time FROM athlete_time_inputs WHERE groupId = %s ORDER BY athleteId, distance", (1,))
    assert all_inputs is not None
    assert len(all_inputs) == 6
    
    expected_inputs = [
        ('1234', 100, 12.5), ('1234', 200, 25.0),
        ('5678', 100, 11.0), ('5678', 200, 22.0),
        ('91011', 100, 10.5), ('91011', 200, 21.0)
    ]
    assert all_inputs == expected_inputs

def test_get_weekly_schedule_coach_success():
    five_days_ago = (datetime.now(timezone.utc) - timedelta(days=5)).strftime("%Y-%m-%d")
    six_days_ago = (datetime.now(timezone.utc) - timedelta(days=6)).strftime("%Y-%m-%d")
    # Arrange
    setup_get_weekly_schedule_scenario()

    event = {
        "queryStringParameters": {"startDate": (datetime.now(timezone.utc) - timedelta(days=8)).strftime("%Y-%m-%d"), "groupId": "1"},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_weekly_schedule(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    debug_table()
    assert len(body) == 2 # Should return two workouts within the week
    assert five_days_ago in body
    assert six_days_ago in body
    assert len(body[six_days_ago])==2

def test_get_weekly_schedule_athlete_success():
    five_days_ago = (datetime.now(timezone.utc) - timedelta(days=5)).strftime("%Y-%m-%d")
    six_days_ago = (datetime.now(timezone.utc) - timedelta(days=6)).strftime("%Y-%m-%d")
    # Arrange
    setup_get_weekly_schedule_scenario()

    event = {
        "queryStringParameters": {"startDate": (datetime.now(timezone.utc) - timedelta(days=8)).strftime("%Y-%m-%d"), "groupId": "1"},
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = get_weekly_schedule(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    debug_table()
    assert len(body) == 2 # Should return two workouts within the week
    assert five_days_ago in body
    assert six_days_ago in body
    assert len(body[six_days_ago])==2
