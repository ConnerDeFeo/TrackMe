import json
import pytest
from lambdas.athlete.input_times.input_times import input_times
from lambdas.history.fetch_historical_data.fetch_historical_data import fetch_historical_data
from lambdas.history.get_earliest_date_available.get_earliest_date_available import get_earliest_date_available
from lambdas.history.get_available_history_dates.get_available_history_dates import get_available_history_dates
from rds import execute_file
from data import TestData
from lambdas.general.create_user.create_user import create_user
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

def test_get_available_history_dates_coach_returns_date_when_inputs_exists():
    # Arrange
    setup_historical_inputs()
    event = {
        "queryStringParameters": {"date": base_date.strftime("%Y-%m")},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_available_history_dates(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 4
    assert date in body

def test_get_available_history_dates_athlete_returns_date_when_inputs_exists():
    # Arrange
    setup_historical_inputs()
    event = {
        "queryStringParameters": {"startDate": three_days_ago, "endDate": date},
        "headers": generate_auth_header("1235", "Athlete", "test_athlete_2")
    }

    # Act
    response = get_available_history_dates(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 1 # should only return the day the athlete input times
    assert two_days_ago in body

def test_get_available_history_dates_with_distance_filters_athlete_returns_success():
    # Arrange
    setup_historical_inputs()
    event = {
        "queryStringParameters": {"date": base_date.strftime("%Y-%m"), "distanceFilters": "1,7"},
        "headers": generate_auth_header("1234", "Athlete", "test_athlete_2")
    }

    # Act
    response = get_available_history_dates(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    print(body)
    assert len(body) == 2
    assert yesterday in body
    assert three_days_ago in body

def test_get_available_history_dates_with_distance_filters_coach_returns_success():
    # Arrange
    setup_historical_inputs()
    event = {
        "queryStringParameters": {"date": base_date.strftime("%Y-%m"), "distanceFilters": "1,5,7"},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }
    four_days_ago = (base_date - timedelta(days=4)).strftime("%Y-%m-%d")
    input_times({
        "body": json.dumps({
            "athleteIds": ["1236"],
            "date": four_days_ago,
            'inputs': [{'distance': 100, 'time': 12.5, 'type': 'run'}]
        }),
        "headers":generate_auth_header("1236", "Athlete", "test3")
    }, {})

    # Act
    response = get_available_history_dates(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    print(body)
    assert len(body) == 3 # yesterday to three days ago for the two athletes added
    assert date not in body
    assert yesterday in body
    assert two_days_ago in body
    assert three_days_ago in body
    assert four_days_ago not in body

def test_fetch_historical_data_coach_success():
    # Arrange
    setup_base_scenario()
    input_times(TestData.test_input_times, {}) # Input for today
    # Input for yesterday to ensure it's filtered out
    input_times({
        "body": json.dumps({
            "athleteIds": ["1234"], 'groupId': 1, "date": yesterday,
            'inputs': [{'distance': 150, 'time': 15.0}]
        }),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }, {})

    event = {
        "queryStringParameters": {"date": date},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = fetch_historical_data(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    
    athlete_inputs = body['1234']
    assert athlete_inputs['username'] == 'test_athlete'
    assert athlete_inputs['inputs'] == [
        {'distance': 100, 'time': 10.8, 'type': 'run'}, 
        {'restTime': 5, 'type': 'rest'}, 
        {'distance': 200, 'time': 30.0, 'type': 'run'}, 
        {'note': 'Test note', 'type': 'note'}
    ]

def test_fetch_historical_data_athlete_success():
    # Arrange
    setup_historical_inputs()

    event = {
        "queryStringParameters": {"date": two_days_ago},
        "headers": generate_auth_header("1235", "Athlete", "test_athlete_2")
    }

    # Act
    response = fetch_historical_data(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])

    assert '1235' in body # Athlete ID
    athlete_time_inputs = body['1235']

    assert athlete_time_inputs['username'] == 'test_athlete_2'
    assert len(athlete_time_inputs['inputs']) == 2
    assert athlete_time_inputs['inputs'] == [{'distance': 3, 'time': 4, 'type': 'run'}, {'distance': 5, 'time': 6, 'type': 'run'}]

def test_fetch_historical_data_no_results():
    # Arrange
    setup_base_scenario()
    event = {
        "queryStringParameters": {"date": date},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = fetch_historical_data(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 0

def test_get_earliest_date_athlete_returns_earliest_date():
    # Arrange
    setup_historical_inputs()

    event = {
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = get_earliest_date_available(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body == three_days_ago

def test_get_earliest_date_coach_returns_earliest_date():
    # Arrange
    setup_historical_inputs()

    input_times({
        "body": json.dumps({
            "athleteIds": ["1236"],
            "date": (base_date - timedelta(days=4)).strftime("%Y-%m-%d"),
            'inputs': [{'distance': 100, 'time': 12.5, 'type': 'run'}]
        }),
        "headers":generate_auth_header("1236", "Athlete", "test3")
    }, {})
    input_times({
        "body": json.dumps({
            "athleteIds": ["1237"],
            "date": (base_date - timedelta(days=4)).strftime("%Y-%m-%d"),
            'inputs': [{'distance': 100, 'time': 12.5, 'type': 'run'}]
        }),
        "headers":generate_auth_header("1237", "Athlete", "test_athlete_4")
    }, {})
    input_times({
        "body": json.dumps({
            "athleteIds": ["1238"],
            "date": (base_date - timedelta(days=4)).strftime("%Y-%m-%d"),
            'inputs': [{'distance': 100, 'time': 12.5, 'type': 'run'}]
        }),
        "headers":generate_auth_header("1238", "Athlete", "test_athlete_5")
    }, {})

    event = {
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_earliest_date_available(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body == three_days_ago # should not include unadded athlete times
