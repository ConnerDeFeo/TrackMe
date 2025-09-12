import json
import pytest
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.create_workout_template.create_workout_template import create_workout_template
from lambdas.coach.delete_workout_template.delete_workout_template import delete_workout_template
from lambdas.general.get_group_workout.get_group_workout import get_group_workout
from lambdas.coach.get_workout_templates.get_workout_templates import get_workout_templates
from lambdas.coach.assign_group_workout_template.assign_group_workout import assign_group_workout_template
from lambdas.coach.create_coach.create_coach import create_coach
from data import TestData
from rds import execute_file, fetch_one, fetch_all
from datetime import datetime, timezone 


date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('./setup.sql')
    create_coach(TestData.test_coach, {})
    create_group(TestData.test_group, {})
    yield

def test_create_workout():
    response = create_workout_template(TestData.test_workout, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workout_id = data['workout_id']
    #Check if workout exists in rds
    workout = fetch_one("SELECT * FROM workouts WHERE id=%s;", (workout_id,))
    print(workout)

    #Bunch of ai generate asserts to check if the data is correct
    assert workout is not None
    assert workout[0] == 1
    assert workout[1] == '123'
    assert workout[2] == 'Test Workout'
    assert workout[3] == 'This is a test workout'
    assert workout[5] # Workout is a template

    assert len(workout[4]) == 3

    exersise1 = workout[4][0]
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

    exersise2 = workout[4][1]
    assert exersise2['name'] == 'Test name 2'
    assert exersise2['sets'] == 2
    assert exersise2['reps'] == 15
    assert len(exersise2['exerciseParts']) == 1
    exersie2_parts = exersise2['exerciseParts']
    assert exersie2_parts[0]['distance'] == 200
    assert exersie2_parts[0]['measurement'] == 'meters'

    exersise3 = workout[4][2]
    assert exersise3['name'] == 'Warm-up'
    assert 'sets' not in exersise3
    assert 'reps' not in exersise3
    assert 'exerciseParts' not in exersise3

def test_assign_group_workout_templates():
    response = create_workout_template(TestData.test_workout, {})
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
    response = assign_group_workout_template(event, {})
    assert response['statusCode'] == 200

    #Check if workout exists in rds
    data = fetch_one("SELECT * FROM group_workouts;")
    assert data is not None
    assert data[0] == 1
    assert data[1] == 1
    assert data[2] == date
    assert data[3] == 1

def test_assign_multiple_workout_templates():
    create_workout_template(TestData.test_workout, {})
    event = {
        "body": json.dumps({
            "groupId": "1",
            "workoutId": 1,
            "date": "2024-01-01" 
        })
    }
    assign_group_workout_template(event, {})
    #Assign a second one to make sure first was overriden
    test_workout_2 = {
        "body": json.dumps({
            'coachId': '123',
            'title': 'Test Workout 2',
            'description': 'This is a test workout 2',
            'exercises': [
                {
                    'name': 'lollygag',
                }
            ]
        })
    }
    response = create_workout_template(test_workout_2, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workout_id = data['workout_id']
    event = {
        "body": json.dumps({ 
            "groupId": "1",
            "workoutId": workout_id,
            "date": "2024-01-01" 
        })
    }
    response = assign_group_workout_template(event, {})
    assert response['statusCode'] == 200

    #Check if workout exists in rds
    data = fetch_all("SELECT * FROM group_workouts")
    print(data)
    assert data is not None
    assert len(data) == 2  # Two workouts should be assigned
    workout = data[0]  # Get the first row
    assert workout[0] == 1
    assert workout[1] == 1
    assert workout[2] == "2024-01-01" 
    assert workout[3] == 1

    workout = data[1]  # Get the second row
    assert workout[0] == 2
    assert workout[1] == 1
    assert workout[2] == "2024-01-01" 
    assert workout[3] == 2

def test_get_workout_templates():
    create_workout_template(TestData.test_workout, {})
    create_workout_template({
        'body': json.dumps({
            "coachId": "123",
            "title": "Test Workout 2",
            "description": "This is a test workout 2",
            "exercises": [
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
                    ]
                }
            ]
        })
    }, {})
    event = {
        "queryStringParameters": {
            "coachId": "123"
        }
    }
    response = get_workout_templates(event, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    assert len(data) == 2

    #Test to see if filtering works
    delete_workout_template({
        "queryStringParameters": {
            "workoutId": 1,
            "coachId": "123"
        }
    },{})

    response = get_workout_templates(event, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    assert len(data) == 1

def test_delete_workout():
    response = create_workout_template(TestData.test_workout, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workout_id = data['workout_id']

    event = {
        "queryStringParameters": {
            "workoutId": workout_id,
            "coachId": "123"
        }
    }
    response = delete_workout_template(event, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    assert data['message'] == 'Workout deleted successfully'
