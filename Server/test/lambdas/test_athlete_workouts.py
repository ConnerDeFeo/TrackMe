import json
import pytest
from lambdas.athlete.input_times.input_times import input_times
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.athlete.remove_inputs.remove_inputs import remove_inputs
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.create_workout_template.create_workout_template import create_workout_template
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.coach.assign_group_workout_template.assign_group_workout_template import assign_group_workout_template
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.athlete.view_workout_inputs.view_workout_inputs import view_workout_inputs
from lambdas.coach.add_athlete_to_group.add_athlete_to_group import add_athlete_to_group
from data import TestData
from rds import execute_file, fetch_all
from datetime import datetime, timezone
from testing_utils import * 

date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    create_athlete(TestData.test_athlete, {})
    create_coach(TestData.test_coach, {})
    create_group(TestData.test_group, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    add_athlete_to_group(TestData.test_add_athlete_to_group, {})
    create_workout_template(TestData.test_workout, {})
    test_assign_workout = {
        "body": json.dumps({
            "workoutId": 1,
            'coachId':'123',
            "groupId": "1"
        }),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }
    assign_group_workout_template(test_assign_workout, {})
    yield

def create_extra_athlete(username,id):
    extra_athlete = {
        "headers":generate_auth_header(id, "Athlete", username)
    }
    create_athlete(extra_athlete, {})

def setup_view_workout_inputs():
    create_extra_athlete("test2", "1235")
    create_extra_athlete("test3", "1236")
    input_times(TestData.test_input_times, {})

    event = {
        'queryStringParameters': {
            "date": date
        },
        "headers":generate_auth_header("1234", "Athlete", "test_athlete")
    }

    expected_inputs = [
        {"distance": 100, "time": 10.8, "inputId": 1},
        {"distance": 200, "time": 30, "inputId": 2}
    ]

    return event, expected_inputs

def setup_remove_inputs_event():
    create_extra_athlete("test3", "1236")
    invite_athlete({
        "body": json.dumps({
            "athleteId": "1236"
        }),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }, {})
    accept_coach_invite({
        "body": json.dumps({
            "coachId": "123"
        }),
        "headers":generate_auth_header("1236", "Athlete", "test3")
    }, {})
    add_athlete_to_group({
        "body": json.dumps({
            "athleteId": "1236",
            "groupId": "1"
        }),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }, {})
    input_times(TestData.test_input_times, {})
    input_times({
        "body": json.dumps({
            "athleteIds": ["1236"],
            'groupId': 1,
            "date": date,
            'inputs': [
                {
                    'distance': 100,
                    'time': 12.5
                }
            ]
        }),
        "headers":generate_auth_header("1236", "Athlete", "test3")
    }, {})

    event = {
        'body': json.dumps({
            "athleteId": "1234",
            "inputIds": [1,3]
        }),
        "headers":generate_auth_header("1234", "Athlete", "test_athlete")
    }

    expected_remaining_inputs = [
        {'athleteId': '1234', 'groupId': 1, 'distance': 200, 'time': 30.0, 'id': 2},
        {'athleteId': '1236', 'groupId': 1, 'distance': 100, 'time': 12.5, 'id': 3}
    ]

    return event, expected_remaining_inputs

def test_input_times_returns_success():
    # Arrange
    event = TestData.test_input_times

    # Act
    response = input_times(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_input_times_persists_inputs_for_athlete():
    # Arrange
    event = TestData.test_input_times

    # Act
    input_times(event, {})
    # Assert
    inputs = fetch_all("SELECT athleteId, groupId, distance, time FROM athlete_time_inputs")
    assert inputs is not None
    assert len(inputs) == 2

    first_input, second_input = inputs
    assert first_input[0] == '1234'
    assert first_input[1] == 1
    assert first_input[2] == 100
    assert first_input[3] == 10.8

    assert second_input[0] == '1234'
    assert second_input[1] == 1
    assert second_input[2] == 200
    assert second_input[3] == 30

def test_timestamps_unique_for_inputs_and_rest_inputs():
    # Arrange
    event = TestData.test_input_times

    # Act
    input_times(event, {})

    # Assert
    inputs = fetch_all("SELECT timeStamp, type from athlete_inputs order by timeStamp")

    assert inputs is not None
    prev = inputs[0][0]
    assert inputs[0][1] == 'run'
    order = ['rest', 'run']
    for i, input in enumerate(inputs[1:]):
        assert input[0] > prev, "Timestamps are not unique or are not in increasing order"
        prev = input[0]
        assert input[1] == order[i], "Timestamps are not in the correct order"

def test_view_workout_inputs_returns_success():
    # Arrange
    event, _ = setup_view_workout_inputs()

    # Act
    response = view_workout_inputs(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_view_workout_inputs_returns_group_inputs():
    # Arrange
    event, expected_inputs = setup_view_workout_inputs()

    # Act
    response = view_workout_inputs(event, {})

    # Assert
    body = json.loads(response['body'])
    assert len(body) == 1

    inputs = body['1']
    assert len(inputs) == len(expected_inputs)
    for expected_input in expected_inputs:
        assert expected_input in inputs

def test_remove_inputs_returns_success():
    # Arrange
    event, _ = setup_remove_inputs_event()

    # Act
    response = remove_inputs(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_remove_inputs_deletes_only_specified_inputs():
    # Arrange
    event, expected_remaining_inputs = setup_remove_inputs_event()

    # Act
    remove_inputs(event, {})

    # Assert
    inputs = fetch_all("SELECT athleteId, groupId, distance, time, id FROM athlete_time_inputs")
    assert inputs is not None
    assert len(inputs) == len(expected_remaining_inputs)

    remaining_inputs = [
        {'athleteId': row[0], 'groupId': row[1], 'distance': row[2], 'time': row[3], 'id': row[4]}
        for row in inputs
    ]

    for expected_input in expected_remaining_inputs:
        assert expected_input in remaining_inputs