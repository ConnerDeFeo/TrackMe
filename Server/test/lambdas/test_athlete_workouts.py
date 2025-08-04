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
from data import test_athlete, test_coach, test_group, test_workout, test_invite, test_accept_group_invite, test_assign_workout, test_workout_group
from rds import execute_file, fetch_one, fetch_all
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
    assert input[2] == 150  # time
    assert input[3] == 30


def test_create_workout_group():
    create_extra_athlete("test2", "1235")
    create_extra_athlete("test3", "1236")

    response = create_workout_group(test_workout_group, {})
    assert response['statusCode'] == 200

    #Check group is created
    workout_group = fetch_one("SELECT * FROM workout_groups")
    assert workout_group is not None
    assert 'Test Workout Group' in workout_group
    assert '1234' in workout_group 

    #Check other athletes are added to the group
    group_members = fetch_all("SELECT * FROM workout_group_members")
    assert group_members is not None
    assert len(group_members) == 2
    for member in group_members:
        assert member[0] == 1
        assert member[1] in ["test2", "test3"]


def test_input_group_time():
    create_extra_athlete("test2", "1235")
    create_extra_athlete("test3", "1236")
    create_workout_group(test_workout_group, {})
    event = {
        "body": json.dumps({
            "leaderId": "1234",
            "workoutTitle": "Test Workout",
            "workoutGroupName": "Test Workout Group",
            "coachUsername": "testcoach",
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "groupName": "Test Group",
            "time": 30,
            "distance": 150
        })
    }

    response = input_group_time(event, {})
    assert response['statusCode'] == 200

    #Make sure the group was created
    group = fetch_one("SELECT leaderId, workoutGroupName FROM workout_groups")
    assert group is not None
    assert group[1] == 'Test Workout Group'
    assert group[0] == '1234'

    #Check that the inputs for all athletes in the group were recorded
    inputs = fetch_all("SELECT * FROM workout_group_inputs")
    assert inputs is not None
    assert len(inputs) == 1  # One for each athlete in the group
    assert inputs[0][0] == 1
    assert inputs[0][1] == 150
    assert inputs[0][2] == 30
