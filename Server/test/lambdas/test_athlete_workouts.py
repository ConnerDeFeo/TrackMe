import json
import pytest
from lambdas.athlete.input_times.input_times import input_times
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.create_workout_template.create_workout_template import create_workout_template
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.coach.assign_group_workout_template.assign_group_workout_template import assign_group_workout_template
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.athlete.view_workout_inputs.view_workout_inputs import view_workout_inputs
from data import TestData
from rds import execute_file, fetch_all
from datetime import datetime, timezone 

date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('./setup.sql')
    create_athlete(TestData.test_athlete, {})
    create_coach(TestData.test_coach, {})
    create_group(TestData.test_group, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    create_workout_template(TestData.test_workout, {})
    test_assign_workout = {
        "body": json.dumps({
            "workoutId": 1,
            'coachId':'123',
            "groupId": "1"
        })
    }
    assign_group_workout_template(test_assign_workout, {})
    yield

def create_extra_athlete(username,id):
    extra_athlete = {
        "body": json.dumps({
            "userId": id,
            "username": username
        })
    }
    create_athlete(extra_athlete, {})

def test_input_times():

    print(TestData.test_input_times)

    response = input_times(TestData.test_input_times, {})
    assert response['statusCode'] == 200

    #Make sure the input was recorded in the database
    inputs = fetch_all("SELECT athleteId, groupId, distance, time FROM athlete_inputs")
    assert inputs is not None
    assert len(inputs) == 2  # Two inputs recorded

    input1 = inputs[0]
    assert input1[0] == '1234'  # athleteId
    assert input1[1] == 1
    assert input1[2] == 100  # distance
    assert input1[3] == 10.8   # time

    input2 = inputs[1]
    assert input2[0] == '1234'  # athleteId
    assert input2[1] == 1
    assert input2[2] == 200  # distance
    assert input2[3] == 30   # time

def test_view_workout_inputs():
    create_extra_athlete("test2", "1235")
    create_extra_athlete("test3", "1236")
    input_times(TestData.test_input_times, {})

    event = {
        'queryStringParameters': {
            "athleteId": "1234",
            "date": date
        }
    }

    response = view_workout_inputs(event, {})
    assert response['statusCode'] == 200

    body = json.loads(response['body'])
    assert len(body) == 1
    inputs = body['1'] # GroupId

    assert len(inputs) == 2
    assert {"distance": 100, "time": 10.8, "inputId":1} in inputs
    assert {"distance": 200, "time": 30, "inputId":2} in inputs
