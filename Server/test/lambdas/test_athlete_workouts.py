import json
import pytest
from lambdas.athlete.input_time.input_time import input_time
from lambdas.athlete.input_group_time.input_group_time import input_group_time
from lambdas.athlete.accept_group_invite.accept_group_invite import accept_group_invite
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.create_workout.create_workout import create_workout
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.coach.assign_group_workout.assign_group_workout import assign_group_workout
from lambdas.athlete.view_workout_athlete.view_workout_athlete import view_workout_athlete
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.athlete.create_workout_group.create_workout_group import create_workout_group
from data import test_athlete, test_coach, test_group, test_workout, test_invite, test_accept_group_invite, test_assign_workout
from rds import execute_file, fetch_one
from datetime import datetime, timezone 


@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    create_athlete(test_athlete, {})
    create_coach(test_coach, {})
    create_group(test_group, {})
    invite_athlete(test_invite, {})
    accept_group_invite(test_accept_group_invite, {})
    create_workout(test_workout, {})
    assign_group_workout(test_assign_workout, {})
    yield


def create_extra_athlete(username,id):
    extra_athlete = {
        "body": json.dumps({
            "userId": id,
            "username": username
        })
    }
    create_athlete(extra_athlete, {})


def test_view_workout_athlete():
    event = {
        "body": json.dumps({
            "groupName": "Test Group",
            "coachId": "123",
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d")
        })
    }

    response = view_workout_athlete(event, {})

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['coach_id'] == '123'
    assert body['title'] == 'Test Workout'
    assert body['description'] == 'This is a test workout'
    assert len(body['excersies']) == 3


def test_input_time():
    event = {
        "body": json.dumps({
            "athleteId": "1234",
            "workoutTitle": "Test Workout",
            "coachUsername": "testcoach",
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "groupName": "Test Group",
            "time": 30,
            "distance": 150
        })
    }

    response = input_time(event, {})
    assert response['statusCode'] == 200

    #Make sure the input was recorded in the database
    input = fetch_one("SELECT * FROM athlete_workout_inputs")
    assert input is not None
    assert input[0] == '1234'  # athleteId
    assert input[1] == 1
    assert input[2] == datetime.now(timezone.utc).strftime("%Y-%m-%d")  # date  
    assert input[3] == 150  # time
    assert input[4] == 30


def test_create_workout_group():
    create_extra_athlete("test2", "1235")
    create_extra_athlete("test3", "1236")
    event = {
        "body": json.dumps({
            "leaderId": "1234",
            "other athletes": ["test2", "test3"],
            "groupName": "Test Group",
            "workoutTitle": "Test Workout",
            "coachUsername": "testcoach",
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d")
        })
    }
    response = create_workout_group(event, {})
    # assert response['statusCode'] == 200


def test_input_group_time():
    create_extra_athlete("test2", "1235")
    create_extra_athlete("test3", "1236")

    event = {
        "body": json.dumps({
            "athleteId": "1234",
            "other athletes": ["test2", "test3"],
            "workoutTitle": "Test Workout",
            "coachUsername": "testcoach",
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "groupName": "Test Group",
            "time": 30,
            "distance": 150
        })
    }

    response = input_group_time(event, {})
    # assert response['statusCode'] == 200

    # input = fetch_all("SELECT * FROM athlete_workout_inputs")
    # assert input is not None
    # assert len(input) == 3  # One for each athlete in the group
    # for i in input:
    #     assert i[0] in ["1234", "test2", "test3"]
    #     assert i[1] == 1
    #     assert i[2] == datetime.now(timezone.utc).strftime("%Y-%m-%d")  # date
    #     assert i[3] == 150  # time
    #     assert i[4] == 30
