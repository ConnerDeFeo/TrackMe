import json
import pytest
from dynamo import get_item
from lambdas.coach.assign_group_workout.assign_group_workout import assign_group_workout
from rds import execute_file, fetch_one
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.create_workout.create_workout import create_workout
from datetime import datetime, timezone
from data import test_coach, test_group, test_workout


@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    create_coach(test_coach, {})
    yield

def test_create_workout():
    create_group(test_group, {})
    response = create_workout(test_workout, {})
    assert response['statusCode'] == 200

    data = get_item('Workouts', {'coach_id': '123', 'title': 'Test Workout'})

    #Bunch of ai generate asserts to check if the data is correct
    assert data is not None
    assert data['title'] == 'Test Workout'
    assert data['description'] == 'This is a test workout'

    assert len(data['excersies']) == 3

    excersise1 = data['excersies'][0]
    assert excersise1['name'] == 'Test name'
    assert excersise1['sets'] == 3
    assert excersise1['reps'] == 10
    assert len(excersise1['excersiesParts']) == 2
    excersie1_parts = excersise1['excersiesParts']
    assert excersie1_parts[0]['distance'] == 100
    assert excersie1_parts[0]['measurement'] == 'meters'
    assert excersie1_parts[1]['distance'] == 50
    assert excersie1_parts[1]['measurement'] == 'meters'

    excersise2 = data['excersies'][1]
    assert excersise2['name'] == 'Test name 2'
    assert excersise2['sets'] == 2
    assert excersise2['reps'] == 15
    assert len(excersise2['excersiesParts']) == 1
    excersie2_parts = excersise2['excersiesParts']
    assert excersie2_parts[0]['distance'] == 200
    assert excersie2_parts[0]['measurement'] == 'meters'

    excersise3 = data['excersies'][2]
    assert excersise3['name'] == 'Warm-up'
    assert 'sets' not in excersise3
    assert 'reps' not in excersise3
    assert 'excersiesParts' not in excersise3

def test_assign_group_workout():
    create_group(test_group, {})
    create_workout(test_workout, {})

    event = {
        "body": json.dumps({
            "userId": "123",
            "groupName": "Test Group",
            "workoutTitle": "Test Workout"
        })
    }
    response = assign_group_workout(event, {})
    assert response['statusCode'] == 200

    data = fetch_one("SELECT * FROM group_workouts;")
    assert data is not None
    assert data[0] == 1
    assert data[1] == 1
    assert data[2] == datetime.now(timezone.utc).strftime("%Y-%m-%d")
    assert data[3] == 'Test Workout'