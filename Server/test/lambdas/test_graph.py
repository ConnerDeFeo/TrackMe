import json
import pytest
from lambdas.athlete.input_times.input_times import input_times
from lambdas.coach.add_athlete_to_group.add_athlete_to_group import add_athlete_to_group
from lambdas.graph.get_work_rest_ratio.get_work_rest_ratio import get_work_rest_ratio
from rds import execute_file
from data import TestData
from lambdas.general.create_user.create_user import create_user
from lambdas.coach.create_group.create_group import create_group
from lambdas.relations.add_relation.add_relation import add_relation  
from datetime import timedelta
from testing_utils import *

base_date = get_base_date()
date = base_date.strftime("%Y-%m-%d")
yesterday = (base_date - timedelta(days=1)).strftime("%Y-%m-%d")
two_days_ago = (base_date - timedelta(days=2)).strftime("%Y-%m-%d")
three_days_ago = (base_date - timedelta(days=3)).strftime("%Y-%m-%d")

# --- Helper Functions ---
def setup_base_scenario():
    """Sets up a coach, athlete, two groups, and adds the athlete to both groups."""
    create_user(TestData.test_coach, {})
    create_user(TestData.test_athlete, {})
    create_user({
        "headers":generate_auth_header("1235", "Athlete", "test_athlete_2")
    }, {})
    add_relation(TestData.test_add_relation_athlete, {})
    add_relation(TestData.test_add_relation_coach, {})
    add_relation({
        "body": json.dumps({
            "relationId": "1235"
        }),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }, {})
    add_relation({
        "body": json.dumps({
            "relationId": "123"
        }),
        "headers":generate_auth_header("1235", "Athlete", "test_athlete_2")
    }, {})

    # Add three kinds of other athletes
    create_user({
        'headers':generate_auth_header("1236", "Athlete", "test_athlete_3")
    }, {})
    create_user({
        'headers':generate_auth_header("1237", "Athlete", "test_athlete_4")
    }, {})
    create_user({
        'headers':generate_auth_header("1238", "Athlete", "test_athlete_5")
    }, {})
    
    # Coach added athlete
    add_relation({
        'body': json.dumps({"relationId": "1236"}),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }, {})
    # Added coach
    add_relation({
        'body': json.dumps({"relationId": "123"}),
        "headers":generate_auth_header("1237", "Athlete", "test_athlete_4")
    }, {})
    
    create_group(TestData.test_group, {}) # Group ID 1
    create_group({
        "body": json.dumps({"groupName": "Test Group 2"}),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {}) # Group ID 2

    add_athlete_to_group(TestData.test_add_athlete_to_group, {}) # Add to Group 1
    add_athlete_to_group({
        "body": json.dumps({"athleteId": "1234", "groupId": 2}),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {}) # Add to Group 2

    add_athlete_to_group({
        "body": json.dumps({"athleteId": "1235", "groupId": 1}),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})
    add_athlete_to_group({
        "body": json.dumps({"athleteId": "1235", "groupId": 2}),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})

def setup_historical_inputs():
    """Inputs a variety of times for an athlete across multiple days and groups."""
    setup_base_scenario()

    # Today's inputs
    input_times(TestData.test_input_times, {}) 
    
    # Yesterday's inputs
    input_times({
        "body": json.dumps({
            "athleteIds": ["1234"], "date": yesterday,
            'inputs': [{'distance': 1, 'time': 2 ,'type': 'run'}]
        }),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }, {})
    
    # Two days ago's inputs
    input_times({
        "body": json.dumps({
            "athleteIds": ["1234", '1235'], "date": two_days_ago,
            'inputs': [{'distance': 3, 'time': 4, 'type': 'run'}, {'distance': 5, 'time': 6, 'type': 'run'}]
        }),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }, {})

    # Three days ago's inputs
    input_times({
        "body": json.dumps({
            "athleteIds": ["1234"], "date": three_days_ago,
            'inputs': [{'restTime': 5, 'type': 'rest'},{'distance': 7, 'time': 8, 'type': 'run'}]
        }),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }, {})

@pytest.fixture(autouse=True)
def setup_before_each_test():
    """This will run before each test, setting up a clean database."""
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    yield

def test_get_work_rest_ratio_returns_success():

    # Arrange
    setup_historical_inputs()
    event = {
        'queryStringParameters': {
            "date": date
        },
        "headers":generate_auth_header("1234", "Athlete", "test_athlete")
    }

    debug_table()
    # Act
    response = get_work_rest_ratio(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    expected_ratios = [
        {"date": three_days_ago, "workRestRatio": 8 / 5.0},
        {"date": date, "workRestRatio": (10.8 + 30) / 5.0}
    ]
    assert body == expected_ratios