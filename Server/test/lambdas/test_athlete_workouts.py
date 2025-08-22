import json
import pytest
from lambdas.athlete.input_times.input_times import input_times
from lambdas.athlete.input_group_time.input_group_time import input_group_time
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.create_workout.create_workout import create_workout
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.coach.assign_group_workout.assign_group_workout import assign_group_workout
from lambdas.athlete.view_workouts_athlete.view_workouts_athlete import view_workouts_athlete
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.athlete.create_workout_group.create_workout_group import create_workout_group
from lambdas.athlete.view_workout_inputs.view_workout_inputs import view_workout_inputs
from data import TestData
from rds import execute_file, fetch_one, fetch_all
from datetime import datetime, timezone 
from testing_utils import debug_table

date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    create_athlete(TestData.test_athlete, {})
    create_coach(TestData.test_coach, {})
    create_group(TestData.test_group, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    create_workout(TestData.test_workout, {})
    test_assign_workout = {
        "body": json.dumps({
            "workoutId": 1,
            'coachId':'123',
            "groupId": "1"
        })
    }
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

def test_view_workouts_athlete():
    workout2 = {
        "body": json.dumps({
            'coachId': '123',
            'title': 'Test Workout2', 
            'description': 'This is a test workout2',
            'exercises': [
                {
                    'name': 'Warm-up',
                }
            ]
        })
    }
    create_workout(workout2, {})
    test_assign_workout = {
        "body": json.dumps({
            "workoutId": 2,
            'coachId':'123',
            "groupId": "1"
        })
    }
    assign_group_workout(test_assign_workout, {})
    event = {
        "queryStringParameters": {
            'groupId':"1",
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d")
        }
    }
    response = view_workouts_athlete(event, {})

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    workout1 = body[0]
    assert len(workout1['exercises']) == 3
    assert workout1['title'] == 'Test Workout'
    assert workout1['description'] == 'This is a test workout'

    workout2 = body[1]
    assert len(workout2['exercises']) == 1
    assert workout2['title'] == 'Test Workout2'
    assert workout2['description'] == 'This is a test workout2'

def test_input_times():

    print(TestData.test_input_times)

    response = input_times(TestData.test_input_times, {})
    assert response['statusCode'] == 200

    #Make sure the input was recorded in the database
    inputs = fetch_all("SELECT * FROM athlete_workout_inputs")
    assert inputs is not None
    assert len(inputs) == 2  # Two inputs recorded

    input1 = inputs[0]
    assert input1[0] == '1234'  # athleteId
    assert input1[1] == 1
    assert input1[2] == 100  # distance
    assert input1[3] == 10   # time

    input2 = inputs[1]
    assert input2[0] == '1234'  # athleteId
    assert input2[1] == 1
    assert input2[2] == 200  # distance
    assert input2[3] == 30   # time

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
    input_group_time(TestData.test_input_group_time, {})
    input_times(TestData.test_input_times, {})

    debug_table()
    event = {
        'queryStringParameters': {
            "userId": "1234",
            "username": "test_athlete",
            "date": date
        }
    }

    response = view_workout_inputs(event, {})
    assert response['statusCode'] == 200

    body = json.loads(response['body'])
    assert len(body) == 2
    group_inputs = body['groups']
    athlete_inputs = body['individuals']

    assert group_inputs['1'] == [{'distance': 150, 'time': 30}]
    assert athlete_inputs['1'] == [{'distance': 100,'time': 10}, {'distance': 200,'time': 30}]