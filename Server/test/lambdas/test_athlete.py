import json
from rds import execute_file
import pytest
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.athlete.get_athlete.get_athlete import get_athlete


@pytest.fixture(autouse=True)
def setup_before_each_test():
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    yield

test_athlete = {
        "body": json.dumps({
            "userId": "123",
            'username': "testuser",
        })
    }

def test_create_athlete():
    #Send a valid JSON event
    response = create_athlete(test_athlete, {})
    assert response['statusCode'] == 200

def test_get_athlete():
    # Send a valid event to get an athlete
    create_athlete(test_athlete, {})
    event = {
        "pathParameters": {
            "userId": "123"
        }
    }
    response = get_athlete(event, {})
    assert response['statusCode'] == 200
    
    athlete = json.loads(response['body'])
    assert '123' in athlete
    assert 'testuser' in athlete