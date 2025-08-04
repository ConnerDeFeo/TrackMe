import json
from rds import execute_file
import pytest
from data import TestData
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.athlete.get_athlete.get_athlete import get_athlete


@pytest.fixture(autouse=True)
def setup_before_each_test():
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    yield

def test_create_athlete():
    #Send a valid JSON event
    response = create_athlete(TestData.test_athlete, {})
    assert response['statusCode'] == 200

def test_get_athlete():
    # Send a valid event to get an athlete
    create_athlete(TestData.test_athlete, {})
    event = {
        "pathParameters": {
            "userId": "1234"
        }
    }
    response = get_athlete(event, {})
    assert response['statusCode'] == 200
    
    athlete = json.loads(response['body'])
    assert '1234' in athlete
    assert 'test_athlete' in athlete