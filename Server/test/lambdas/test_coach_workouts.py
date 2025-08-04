import json
import pytest
from dynamo import get_item
from lambdas.coach.assign_group_workout.assign_group_workout import assign_group_workout
from rds import execute_file, fetch_one
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.create_workout.create_workout import create_workout
from datetime import datetime, timezone
from data import TestData


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
    assert excersise1['inputs'] is True

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
    create_workout(TestData.test_workout, {})

    event = {
        "body": json.dumps({
            "userId": "123",
            "groupName": "Test Group",
            "title": "Test Workout"
        })
    }
    response = assign_group_workout(event, {})
    assert response['statusCode'] == 200

    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    #Check if workout exists in rds
    data = fetch_one("SELECT * FROM group_workouts;")
    assert data is not None
    assert data[0] == 1
    assert data[1] == 1
    assert data[2] == date
    assert data[3] == 'Test Workout'

def test_view_workout_coach():
    pass
    # The format for this should be:
    # {
    #   coach_id: 1234
    #   workout title: some title
    #   workout: {the workout from dynamo}
    #   inputs: {
    #       groups:{
    #           "leader": "some user"
    #           "some group":[[distance, time], [distance, time]],
    #           ""
    #       } 
    #       individuals{
    #           "some user":[[distance, time], [distance, time]]
    #       }#
    #   }#
    # }
    # #