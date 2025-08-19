import json
import pytest
from lambdas.athlete.input_time.input_time import input_time
from lambdas.athlete.input_group_time.input_group_time import input_group_time
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.create_workout.create_workout import create_workout
from lambdas.coach.delete_workout.delete_workout import delete_workout
from lambdas.coach.get_group_workout.get_group_workout import get_group_workout
from lambdas.coach.get_workouts.get_workouts import get_workouts
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.coach.assign_group_workout.assign_group_workout import assign_group_workout
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.athlete.create_workout_group.create_workout_group import create_workout_group
from lambdas.coach.view_workout_coach.view_workout_coach import view_workout_coach
from testing_utils import reset_dynamo
from data import TestData
from rds import execute_file, fetch_one, fetch_all
from datetime import datetime, timezone 
from dynamo import get_item
from testing_utils import debug_table


date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    create_coach(TestData.test_coach, {})
    create_group(TestData.test_group, {})
    yield

def test_create_workout():
    response = create_workout(TestData.test_workout, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workout_id = data['workout_id']

    workout = get_item('Workouts', {'coach_id': '123', 'workout_id': workout_id})
    print(workout)

    #Bunch of ai generate asserts to check if the data is correct
    assert workout is not None
    assert workout['title'] == 'Test Workout'
    assert workout['description'] == 'This is a test workout'

    assert len(workout['exercises']) == 3

    exersise1 = workout['exercises'][0]
    assert exersise1['name'] == 'Test name'
    assert exersise1['sets'] == 3
    assert exersise1['reps'] == 10
    assert len(exersise1['exerciseParts']) == 2
    exersie1_parts = exersise1['exerciseParts']
    assert exersie1_parts[0]['distance'] == 100
    assert exersie1_parts[0]['measurement'] == 'meters'
    assert exersie1_parts[1]['distance'] == 50
    assert exersie1_parts[1]['measurement'] == 'meters'
    assert exersise1['inputs'] is True

    exersise2 = workout['exercises'][1]
    assert exersise2['name'] == 'Test name 2'
    assert exersise2['sets'] == 2
    assert exersise2['reps'] == 15
    assert len(exersise2['exerciseParts']) == 1
    exersie2_parts = exersise2['exerciseParts']
    assert exersie2_parts[0]['distance'] == 200
    assert exersie2_parts[0]['measurement'] == 'meters'

    exersise3 = workout['exercises'][2]
    assert exersise3['name'] == 'Warm-up'
    assert 'sets' not in exersise3
    assert 'reps' not in exersise3
    assert 'exerciseParts' not in exersise3

def test_assign_group_workout():
    response = create_workout(TestData.test_workout, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workout_id = data['workout_id']

    event = {
        "body": json.dumps({ 
            "coachId": "123",
            "groupId": "1",
            "workoutId": workout_id
        })
    }
    response = assign_group_workout(event, {})
    assert response['statusCode'] == 200

    #Check if workout exists in rds
    data = fetch_one("SELECT * FROM group_workouts;")
    assert data is not None
    assert data[0] == 1
    assert data[1] == 1
    assert data[2] == date
    assert data[3] == workout_id

def test_assign_multiple_workouts():
    response = create_workout(TestData.test_workout, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workout_id = data['workout_id']

    event = {
        "body": json.dumps({ 
            "coachId": "123",
            "groupId": "1",
            "workoutId": workout_id,
            "date": "2024-01-01" 
        })
    }
    assign_group_workout(event, {})
    #Assign a second one to make sure first was overriden
    test_workout_2 = {
        "body": json.dumps({
            'coachId': '123',
            'workoutId':"workout123",
            'title': 'Test Workout 2',
            'description': 'This is a test workout 2',
            'exercise': [
                {
                    'name': 'lollygag',
                }
            ]
        })
    }
    create_workout(test_workout_2, {})
    event = {
        "body": json.dumps({ 
            "coachId": "123",
            "groupId": "1",
            "workoutId": "workout123",
            "date": "2024-01-01" 
        })
    }
    response = assign_group_workout(event, {})
    assert response['statusCode'] == 200

    #Check if workout exists in rds
    data = fetch_all("SELECT * FROM group_workouts")
    assert data is not None
    assert len(data) == 1  # Only one workout should be assigned
    data = data[0]  # Get the first row
    assert data[0] == 2
    assert data[1] == 1
    assert data[2] == "2024-01-01" 
    assert data[3] == "workout123"

def test_view_workout_coach():
    reset_dynamo()
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    response = create_workout(TestData.test_workout, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workout_id = data['workout_id']
    test_assign_workout = {
        "body": json.dumps({
            "workoutId": workout_id,
            "coachId": "123",
            "groupId": "1"
        })
    }
    assign_group_workout(test_assign_workout, {})

    test_workout_group = {
            "body": json.dumps({
                "leaderId": "1234",
                "athletes": ["test_athlete","test2", "test3"],
                "groupName": "Test Group",
                "workoutGroupName": "Test Workout Group",
                "workoutId": workout_id,
                "coachUsername": "testcoach",
                "date": datetime.now(timezone.utc).strftime("%Y-%m-%d")
            })
        }
    create_workout_group(test_workout_group, {})
    test_input_time = {
            "body": json.dumps({
                "athleteId": "1234",
                "workoutId": workout_id,
                "coachUsername": "testcoach",
                "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                "groupName": "Test Group",
                "time": 10,
                "distance": 100
            })
        }

    test_input_group_time = {
        "body": json.dumps({
            "leaderId": "1234",
            "workoutId": workout_id,
            "workoutGroupName": "Test Workout Group",
            "coachUsername": "testcoach",
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "groupName": "Test Group",
            "time": 30,
            "distance": 150
        })
    }
    input_time(test_input_time, {})
    input_group_time(test_input_group_time, {})

    event = {
        "queryStringParameters": {
            "date": date,
            "groupName": "Test Group",
            "coachId": "123"
        }
    }
    response = view_workout_coach(event, {})
    assert response['statusCode'] == 200

    #Check if the data is valid
    data = json.loads(response['body'])
    workout_data = data['Items']
    assert workout_data is not None
    assert len(workout_data) == 2
    group_workout_input = workout_data[0]
    individual_workout_input = workout_data[1]

    assert group_workout_input['group_date_identifier'] == f'123#Test Group#{date}'
    assert group_workout_input['input_type'] == 'group#Test Workout Group'
    assert group_workout_input['leader_id'] == '1234'
    
    inputs = group_workout_input['inputs']
    assert len(inputs) == 1
    assert inputs[0]['distance'] == 150
    assert inputs[0]['time'] == 30

    inputs = individual_workout_input['inputs']
    assert len(inputs) == 1
    assert inputs[0]['distance'] == 100
    assert inputs[0]['time'] == 10

def test_get_workouts():
    reset_dynamo()
    create_workout(TestData.test_workout, {})
    create_workout({
        'body': json.dumps({
            "coachId": "123",
            "title": "Test Workout 2",
            "description": "This is a test workout 2",
            "exercise": [
                {
                "name": "Test name 3",
                "sets": 3,
                "reps": 10,
                "exerciseParts": [
                    {
                        "distance": 100,
                        "measurement": "meters"
                    },
                    {
                        "distance": 50,
                        "measurement": "meters"
                    }
                ],
                "inputs": True
            }
        ]
        })
    }, {})
    event = {
        "queryStringParameters": {
            "coach_id": "123"
        }
    }
    response = get_workouts(event, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workouts = data['Items']
    assert len(workouts) == 2

    #Test to see if filtering works
    delete_workout({
        "body": json.dumps({
            "workoutId": workouts[0]['workout_id'],
            "coachId": "123"
        })
    },{})

    response = get_workouts(event, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workouts = data['Items']
    assert len(workouts) == 1
    

def test_get_group_workout():
    reset_dynamo()
    response = create_workout(TestData.test_workout, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workout_id = data['workout_id']
    test_assign_workout = {
        "body": json.dumps({
            "workoutId": workout_id,
            "coachId": "123",
            "groupId": "1"
        })
    }
    assign_group_workout(test_assign_workout, {})

    event = {
        "queryStringParameters": {
            "coachId": "123",
            "groupId": "1",
            "date": date
        }
    }
    response = get_group_workout(event, {})
    assert response['statusCode'] == 200

    # Check if the data is valid
    workout = json.loads(response['body'])
    assert workout['title'] == 'Test Workout'
    assert workout['coach_id'] == '123'
    assert len(workout['exercises']) == 3
    assert workout['description']=='This is a test workout'

def test_delete_workout():
    reset_dynamo()
    response = create_workout(TestData.test_workout, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workout_id = data['workout_id']

    event = {
        "body": json.dumps({
            "workoutId": workout_id,
            "coachId": "123"
        })
    }
    response = delete_workout(event, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    assert data['message'] == 'Workout deleted successfully'