import json
import pytest
from lambdas.athlete.input_times.input_times import input_times
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
from lambdas.general.mass_input.mass_input import mass_input
from datetime import datetime, timezone
from testing_utils import *

date = datetime.now(timezone.utc).strftime("%Y-%m-%d")


@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('./setup.sql')
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    create_group(TestData.test_group, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    add_athlete_to_group(TestData.test_add_athlete_to_group, {})
    yield

def generate_athlete(username, userId):
    create_athlete( {
        "headers": generate_auth_header(userId, "Athlete", username)
    },{}) 

def test_get_groups_athlete():
    response = get_groups(TestData.test_get_group_athlete, {})
    assert response['statusCode'] == 200

    groups = json.loads(response['body'])
    assert len(groups) == 1
    assert groups[0][0] == 'Test Group'
    assert groups[0][1] == 1

def test_get_groups_coach():
    create_group({
        "body": json.dumps({
            "groupName": "Test Group 2"
        }),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})
    response = get_groups(TestData.test_get_group_coach, {})
    assert response['statusCode'] == 200

    groups = json.loads(response['body'])
    assert len(groups) == 2
    assert groups[0][0] == 'Test Group'
    assert groups[0][1] == 1
    assert groups[1][0] == 'Test Group 2'
    assert groups[1][1] == 2

def test_get_group_after_deletion():
    delete_group({
        "queryStringParameters": {
            "groupId": "1"
        },
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})
    response = get_groups(TestData.test_get_group_athlete, {})
    assert response['statusCode'] == 404

def test_get_athletes_for_group():
    create_group(TestData.test_group, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    add_athlete_to_group(TestData.test_add_athlete_to_group, {})
    create_athlete({
        "body": json.dumps({
            "userId": "1235",
            "username": "testathlete2"
        })
    }, {})
    invite_athlete({
        "body": json.dumps({
            "athleteId": "1235",
            "coachId": "123"
        })
    }, {})
    accept_coach_invite({
        "body": json.dumps({
            "athleteId": "1235",
            "coachId": "123"
        })
    }, {})

    event = {
        "queryStringParameters": {
            "groupId": "1"
        }
    }

    response = get_athletes_for_group(event, {})
    assert response['statusCode'] == 200

    body = json.loads(response['body'])
    assert len(body) == 1

    assert body[0][0] == "1234"
    assert body[0][1] == "test_athlete"

def test_view_group_inputs():
    input_times(TestData.test_input_times, {})
    event = {
        "queryStringParameters": {
            "groupId": 1
        }
    }
    response = view_group_inputs(event, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    assert len(data) == 1
    inputed_times = data['1234']
    assert len(inputed_times) == 2
    assert inputed_times[0]['distance'] == 100
    assert inputed_times[0]['time'] == 10.8
    assert inputed_times[1]['distance'] == 200
    assert inputed_times[1]['time'] == 30

def test_get_user():
    create_athlete(TestData.test_athlete, {})
    update_athlete_profile(TestData.test_update_athlete_profile, {})
    create_coach(TestData.test_coach, {})
    update_coach_profile(TestData.test_update_coach_profile, {})

    athlete_response = get_user({
        "headers": generate_auth_header("1234", "Athlete", "test_athlete"),
    }, {})
    coach_response = get_user({
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})
    assert athlete_response['statusCode'] == 200
    assert coach_response['statusCode'] == 200

    athlete_data = json.loads(athlete_response['body'])
    coach_data = json.loads(coach_response['body'])

    assert athlete_data['username'] == "test_athlete"
    assert athlete_data['bio'] == "Updated bio"
    assert athlete_data['firstName'] == "Updated"
    assert athlete_data['lastName'] == "Name"
    assert athlete_data['gender'] == "Male"
    assert athlete_data['profilePictureUrl'] is None
    assert athlete_data['bodyWeight'] == 70
    assert athlete_data['tffrsUrl'] == "someurl"

    assert coach_data['username'] == "testcoach"
    assert coach_data['bio'] == "Updated bio"
    assert coach_data['firstName'] == "Updated"
    assert coach_data['lastName'] == "Name"
    assert coach_data['gender'] == "Female"
    assert coach_data['profilePictureUrl'] is None

def test_remove_coach_athlete():
    response = remove_coach_athlete({
        "queryStringParameters": {
            "coachId": "123",
            "athleteId": "1234"
        },
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})
    assert response['statusCode'] == 200
    relationships = fetch_one(
    """
        SELECT * FROM athlete_coaches WHERE coachId = %s AND athleteId = %s
    """, ("123", "1234"))
    assert relationships is None

def test_get_group_workout():
    response = create_workout_template(TestData.test_workout, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workout_id = data['workout_id']
    test_assign_workout = {
        "body": json.dumps({
            "workoutId": workout_id,
            "groupId": "1"
        }),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }
    assign_group_workout_template(test_assign_workout, {})

    event = {
        "queryStringParameters": {
            "groupId": "1",
            "date": date
        },
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }
    response = get_group_workout(event, {})
    assert response['statusCode'] == 200

    # Check if the data is valid
    workout = json.loads(response['body'])
    workout = workout[0]
    assert workout['workoutId'] == 1
    assert workout['title'] == 'Test Workout'
    assert workout['description'] == 'This is a test workout'
    assert len(workout['exercises']) == 3

def test_get_pending_proposals():
    create_athlete({
        "headers": generate_auth_header("1235", "Athlete", "testathlete2")
    }, {})
    invite_athlete({
        "body": json.dumps({
            "athleteId": "1235"
        }),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})

    event = {
        "headers": generate_auth_header("1235", "Athlete", "testathlete2")
    }
    debug_table()
    response = get_pending_proposals(event, {})
    assert response['statusCode'] == 200

    body = json.loads(response['body'])
    assert len(body) == 1

    assert body["count"] == 1

def test_mass_input():
    generate_athlete("testathlete2", "5678")
    generate_athlete("testathlete3", "91011")
    invite_athlete({
        "body": json.dumps({
            "athleteId": "91011"
        }),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})
    invite_athlete({
        "body": json.dumps({
            "athleteId": "5678"
        }),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})
    accept_coach_invite({
        "body": json.dumps({
            "coachId": "123"
        }),
        "headers": generate_auth_header("91011", "Athlete", "testathlete3")
    }, {})
    accept_coach_invite({
        "body": json.dumps({
            "coachId": "123"
        }),
        "headers": generate_auth_header("5678", "Athlete", "testathlete2")
    }, {})
    event = {
        "body": json.dumps({
            "groupId": 1,
            "athleteData": {
                "1234": [  # Existing athlete
                    {"time": 12.5, "distance": 100},
                    {"time": 25.0, "distance": 200}
                ],
                "5678": [  # New athlete
                    {"time": 11.0, "distance": 100},
                    {"time": 22.0, "distance": 200}
                ],
                "91011": [  # New athlete
                    {"time": 10.5, "distance": 100},
                    {"time": 21.0, "distance": 200}
                ]
            }
        }),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    response = mass_input(event, {})
    assert response['statusCode'] == 200

    data = fetch_all("""
        SELECT * FROM athlete_inputs WHERE groupId = %s
    """, (1,))
    assert data is not None
    assert len(data) == 6  # 3 athletes * 2 inputs each


    # Check if the data is correct
    athlete1_inputs = [d for d in data if d[1] == '1234']
    athlete2_inputs = [d for d in data if d[1] == '5678']
    athlete3_inputs = [d for d in data if d[1] == '91011']
    assert len(athlete1_inputs) == 2
    assert len(athlete2_inputs) == 2
    assert len(athlete3_inputs) == 2

    assert athlete1_inputs[0][3] == 100
    assert athlete1_inputs[0][4] == 12.5
    assert athlete1_inputs[0][5] == date
    assert athlete1_inputs[1][3] == 200
    assert athlete1_inputs[1][4] == 25.0
    assert athlete1_inputs[1][5] == date

    assert athlete2_inputs[0][3] == 100
    assert athlete2_inputs[0][4] == 11.0
    assert athlete2_inputs[0][5] == date
    assert athlete2_inputs[1][3] == 200
    assert athlete2_inputs[1][4] == 22.0
    assert athlete2_inputs[1][5] == date

    assert athlete3_inputs[0][3] == 100
    assert athlete3_inputs[0][4] == 10.5
    assert athlete3_inputs[0][5] == date
    assert athlete3_inputs[1][3] == 200
    assert athlete3_inputs[1][4] == 21.0
    assert athlete3_inputs[1][5] == date
