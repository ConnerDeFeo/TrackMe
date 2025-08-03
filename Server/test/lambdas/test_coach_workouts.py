import json
import pytest
from dynamo import get_item
from rds import execute_file
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.create_workout.create_workout import create_workout


test_coach = {
        "body": json.dumps({
            "userId": "123",
            'username': "testcoach",
        })
    }
test_group = {
        "body": json.dumps({
            "groupName": "Test Group",
            "userId": "123"
        })
    }

test_workout = {
    "body": json.dumps({
        "coach_id": "123",
        "title": "Test Workout",
        "description": "This is a test workout",
        "excersies": [
            {
                "name": "Test name",
                "sets": 3,
                "reps": 10,
                "excersiesParts": [
                    {
                        "distance": 100,
                        "measurement": "meters"
                    },
                    {
                        "distance": 50,
                        "measurement": "meters"
                    }
                ]
            },
            {
                "name": "Test name 2",
                "sets": 2,
                "reps": 15,
                "excersiesParts": [
                    {
                        "distance": 200,
                        "measurement": "meters"
                    }
                ]
            },
            {
                "name": "Warm-up",
            }
        ]
    })
}

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
    assert data['excersies'][0]['name'] == 'Test name'
    assert data['excersies'][0]['sets'] == 3
    assert data['excersies'][0]['reps'] == 10
    assert len(data['excersies'][0]['excersiesParts']) == 2
    assert data['excersies'][0]['excersiesParts'][0]['distance'] == 100
    assert data['excersies'][0]['excersiesParts'][0]['measurement'] == 'meters'

    assert data['excersies'][1]['name'] == 'Test name 2'
    assert data['excersies'][1]['sets'] == 2
    assert data['excersies'][1]['reps'] == 15
    assert len(data['excersies'][1]['excersiesParts']) == 1
    assert data['excersies'][1]['excersiesParts'][0]['distance'] == 200
    assert data['excersies'][1]['excersiesParts'][0]['measurement'] == 'meters'
    
    assert data['excersies'][2]['name'] == 'Warm-up'
    assert 'excersiesParts' not in data['excersies'][2]