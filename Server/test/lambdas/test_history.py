import json
import pytest
from lambdas.athlete.input_times.input_times import input_times
from lambdas.coach.fetch_historical_data.fetch_historical_data import fetch_historical_data
from lambdas.coach.add_athlete_to_group.add_athlete_to_group import add_athlete_to_group
from lambdas.workout.assign_group_workout_template.assign_group_workout_template import assign_group_workout_template
from lambdas.workout.create_workout_template.create_workout_template import create_workout_template
from lambdas.coach.get_available_history_dates.get_available_history_dates import get_available_history_dates
from rds import execute_file
from data import TestData
from lambdas.general.create_user.create_user import create_user
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.search_input_history_date.search_input_history_date import search_input_history_date
from lambdas.relations.add_relation.add_relation import add_relation  
from datetime import datetime, timedelta, timezone
from testing_utils import *
    
date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")

# --- Helper Functions ---

def setup_base_scenario():
    """Sets up a coach, athlete, two groups, and adds the athlete to both groups."""
    create_user(TestData.test_coach, {})
    create_user(TestData.test_athlete, {})
    add_relation(TestData.test_add_relation_athlete, {})
    add_relation(TestData.test_add_relation_coach, {})
    
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

def setup_historical_inputs():
    """Inputs a variety of times for an athlete across multiple days and groups."""
    setup_base_scenario()
    
    two_days_ago = (datetime.now(timezone.utc) - timedelta(days=2)).strftime("%Y-%m-%d")
    three_days_ago = (datetime.now(timezone.utc) - timedelta(days=3)).strftime("%Y-%m-%d")

    # Today's inputs
    input_times(TestData.test_input_times, {}) 
    
    # Yesterday's inputs
    input_times({
        "body": json.dumps({
            "athleteIds": ["1234"], 'groupId': 1, "date": yesterday,
            'inputs': [{'distance': 1, 'time': 2 ,'type': 'run'}]
        }),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }, {})
    
    # Two days ago's inputs
    input_times({
        "body": json.dumps({
            "athleteIds": ["1234"], 'groupId': 2, "date": two_days_ago,
            'inputs': [{'distance': 3, 'time': 4, 'type': 'run'}, {'distance': 5, 'time': 6, 'type': 'run'}]
        }),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }, {})

    # Three days ago's inputs
    input_times({
        "body": json.dumps({
            "athleteIds": ["1234"], 'groupId': 2, "date": three_days_ago,
            'inputs': [{'restTime': 5, 'type': 'rest'},{'distance': 7, 'time': 8, 'type': 'run'}]
        }),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }, {})

def setup_workout_for_today():
    """Creates and assigns a workout template for today."""
    setup_base_scenario()
    response = create_workout_template(TestData.test_workout, {})
    workout_id = json.loads(response['body'])['workout_id']
    assign_group_workout_template({
        "body": json.dumps({"groupId": "1", "workoutId": workout_id}),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})

@pytest.fixture(autouse=True)
def setup_before_each_test():
    """This will run before each test, setting up a clean database."""
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    yield

# --- Test Cases ---
    
def test_search_input_history_date_success():
    # Arrange
    setup_historical_inputs()
    event = {
        "queryStringParameters": {"date": yesterday},
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = search_input_history_date(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    
    two_days_ago = (datetime.now(timezone.utc) - timedelta(days=2)).strftime("%Y-%m-%d")
    three_days_ago = (datetime.now(timezone.utc) - timedelta(days=3)).strftime("%Y-%m-%d")

    assert len(body) == 3 # Should return history for yesterday and the two previous days
    assert yesterday in body
    assert two_days_ago in body
    assert three_days_ago in body

    assert body[yesterday]['1']['name'] == 'Test Group'
    assert body[yesterday]['1']['inputs'] == [{'distance': 1, 'time': 2.0, 'type': 'run'}]
    
    assert body[two_days_ago]['2']['name'] == 'Test Group 2'
    assert body[two_days_ago]['2']['inputs'] == [{'distance': 3, 'time': 4.0, 'type': 'run'}, {'distance': 5, 'time': 6.0, 'type': 'run'}]

    assert body[three_days_ago]['2']['name'] == 'Test Group 2'
    assert body[three_days_ago]['2']['inputs'] == [{'restTime': 5, 'type': 'rest'}, {'distance': 7, 'time': 8.0, 'type': 'run'}]

def test_search_input_history_no_results():
    # Arrange
    setup_base_scenario()
    event = {
        "queryStringParameters": {"date": date},
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = search_input_history_date(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 0

def test_get_available_history_dates_returns_date_when_workout_exists():
    # Arrange
    setup_workout_for_today()
    event = {
        "queryStringParameters": {"date": date},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_available_history_dates(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 1
    assert date in body

def test_get_available_history_dates_returns_empty_when_no_workout():
    # Arrange
    setup_base_scenario()
    event = {
        "queryStringParameters": {"date": yesterday},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_available_history_dates(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 0

def test_fetch_historical_data_success():
    # Arrange
    setup_workout_for_today()
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
    
    assert '1' in body # Group ID
    group_data = body['1']
    
    assert group_data['name'] == 'Test Group'
    assert len(group_data['workouts']) == 1
    assert group_data['workouts'][0]['title'] == 'Test Workout'
    
    assert '1234' in group_data['athleteInputs'] # Athlete ID
    athlete_time_inputs = group_data['athleteInputs']['1234']
    
    assert athlete_time_inputs['username'] == 'test_athlete'
    assert len(athlete_time_inputs['inputs']) == 3
    assert athlete_time_inputs['inputs'] == [{'distance': 100, 'time': 10.8, 'type': 'run'}, {'restTime': 5, 'type': 'rest'}, {'distance': 200, 'time': 30.0, 'type': 'run'}]

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