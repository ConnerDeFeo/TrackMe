import json
import os
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
from lambdas.athlete.view_workout_inputs.view_workout_inputs import view_workout_inputs
from data import TestData
from rds import execute_file, fetch_one, fetch_all
from datetime import datetime, timezone 
from testing_utils import reset_dynamo
from dynamo import get_item

date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    create_athlete(TestData.test_athlete, {})
    create_coach(TestData.test_coach, {})
    create_group(TestData.test_group, {})
    invite_athlete(TestData.test_invite, {})
    accept_group_invite(TestData.test_accept_group_invite, {})
    create_workout(TestData.test_workout, {})
    assign_group_workout(TestData.test_assign_workout, {})
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
    reset_dynamo()
    response = input_time(TestData.test_input_time, {})
    assert response['statusCode'] == 200

    #Make sure the input was recorded in the database
    input = fetch_one("SELECT * FROM athlete_workout_inputs")
    assert input is not None
    assert input[0] == '1234'  # athleteId
    assert input[1] == 1
    assert input[2] == 100  # time
    assert input[3] == 10

    #Check dynamoDB for the input
    input = get_item("WorkoutInputs", {"group_date_identifier": f"123#Test Group#{date}", "input_type": "individual#1234"})
    assert input is not None
    assert len(input['inputs']) == 1
    assert input['inputs'][0]['distance'] == 100
    assert input['inputs'][0]['time'] == 10



def test_create_workout_group():
    create_extra_athlete("test2", "1235")
    create_extra_athlete("test3", "1236")

    response = create_workout_group(TestData.test_workout_group, {})
    assert response['statusCode'] == 200

    #Check group is created
    workout_group = fetch_one("SELECT * FROM workout_groups")
    assert workout_group is not None
    assert 'Test Workout Group' in workout_group
    assert '1234' in workout_group 

    #Check other athletes are added to the group
    group_members = fetch_all("SELECT * FROM workout_group_members")
    assert group_members is not None
    assert len(group_members) == 3
    for member in group_members:
        assert member[0] == 1
        assert member[1] in ["test_athlete", "test2", "test3"]


def test_input_group_time():
    create_extra_athlete("test2", "1235")
    create_extra_athlete("test3", "1236")
    create_workout_group(TestData.test_workout_group, {})

    response = input_group_time(TestData.test_input_group_time, {})
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


def test_view_workout_inputs():
    create_extra_athlete("test2", "1235")
    create_extra_athlete("test3", "1236")
    create_workout_group(TestData.test_workout_group, {})
    input_time(TestData.test_input_time, {})
    input_group_time(TestData.test_input_group_time, {})

    event = {
        "body": json.dumps({
            "userId": "1234",
            "username": "test_athlete",
            "date": date
        })
    }

    response = view_workout_inputs(event, {})
    assert response['statusCode'] == 200

    ##
    # The data returned should look something like:
    # [
    #   [groupName, coachUsername, workoutGroupName, distance, time], 
    #   [groupName, coachUsername, workoutGroupName, distance, time],
    #   [groupName, coachUsername, username, distance, time], 
    #   [groupName, coachUsername, username, distance, time]
    # ]
    body = json.loads(response['body'])

    print(body)
    assert len(body) == 2
    group_inputs = body[0]
    athlete_inputs = body[1]

    assert len(group_inputs) == 5  # groupName, coachUsername, workoutGroupName, distance, time
    assert group_inputs[0] == 'Test Group'
    assert group_inputs[1] == 'testcoach'
    assert group_inputs[2] == 'Test Workout Group'
    assert group_inputs[3] == 150
    assert group_inputs[4] == 30

    assert len(athlete_inputs) == 4  # groupName, coachUsername, distance, time
    assert athlete_inputs[0] == 'Test Group'
    assert athlete_inputs[1] == 'testcoach'
    assert athlete_inputs[2] == 100
    assert athlete_inputs[3] == 10