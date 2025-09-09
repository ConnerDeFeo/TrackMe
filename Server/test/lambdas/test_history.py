import json
import pytest
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.athlete.input_times.input_times import input_times
from lambdas.coach.add_athlete_to_group.add_athlete_to_group import add_athlete_to_group
from lambdas.coach.assign_group_workout.assign_group_workout import assign_group_workout
from lambdas.coach.create_workout.create_workout import create_workout
from lambdas.coach.get_available_history_dates.get_available_history_dates import get_available_history_dates
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from rds import execute_file
from data import TestData
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.athlete.search_input_history_date.search_input_history_date import search_input_history_date
from datetime import datetime, timedelta, timezone
from testing_utils import debug_table
    
date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('./setup.sql')
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    create_group(TestData.test_group, {})
    create_group({
        "body": json.dumps({
            "groupName": "Test Group 2",
            "coachId": "123"
        })
    }, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    add_athlete_to_group(TestData.test_add_athlete_to_group, {})
    add_athlete_to_group({
        "body": json.dumps({
            "athleteId": "1234",
            "coachId": "123",
            "groupId": 2
        })
    }, {})
    yield
    
def test_search_input_history_date():
    two_days_ago = (datetime.now(timezone.utc) - timedelta(days=2)).strftime("%Y-%m-%d")
    three_days_ago = (datetime.now(timezone.utc) - timedelta(days=3)).strftime("%Y-%m-%d")
    input_times(TestData.test_input_times, {})
    # Input variety of times
    input_times({
        "body": json.dumps({
            "athleteIds": ["1234"],
            'groupId': 1,
            "date": yesterday,
            'inputs': [
                {
                    'distance': 1,
                    'time': 2
                }
            ]
        })
    }, {})
    input_times({
        "body": json.dumps({
            "athleteIds": ["1234"],
            'groupId': 2,
            "date": two_days_ago,
            'inputs': [
                {
                    'distance': 3,
                    'time': 4
                },
                {
                    'distance': 5,
                    'time': 6
                }
            ]
        })
    }, {})
    input_times({
        "body": json.dumps({
            "athleteIds": ["1234"],
            'groupId': 2,
            "date": three_days_ago,
            'inputs': [
                {
                    'distance': 7,
                    'time': 8
                }
            ]
        })
    }, {})

    response =  search_input_history_date({
        "queryStringParameters": {
            "athleteId": "1234",
            "date": yesterday
        }
    }, {})

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 3 # Yesterday's and the two previous days
    assert yesterday in body
    assert two_days_ago in body
    assert three_days_ago in body

    inputs_yesterday = body[yesterday]
    assert inputs_yesterday['1']['inputs'] == [{'distance': 1, 'time': 2.0}]
    assert inputs_yesterday['1']['name'] == 'Test Group'

    inputs_two_days_ago = body[two_days_ago]
    assert inputs_two_days_ago['2']['inputs'] == [{'distance': 3, 'time': 4.0}, {'distance': 5, 'time': 6.0}]
    assert inputs_two_days_ago['2']['name'] == 'Test Group 2'

    inputs_three_days_ago = body[three_days_ago]
    assert inputs_three_days_ago['2']['inputs'] == [{'distance': 7, 'time': 8.0}]
    assert inputs_three_days_ago['2']['name'] == 'Test Group 2'

def test_get_available_history_dates():
    response = create_workout(TestData.test_workout, {})
    assert response['statusCode'] == 200
    data = json.loads(response['body'])
    workout_id = data['workout_id']
    assign_group_workout({
        "body": json.dumps({ 
            "coachId": "123",
            "groupId": "1",
            "workoutId": workout_id
        })
    }, {})
    response = get_available_history_dates({
        "queryStringParameters": {
            "coachId": "123",
            "date": date
        }
    }, {})

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    debug_table()
    print(date)
    assert len(body) == 1

    response = get_available_history_dates({
        "queryStringParameters": {
            "coachId": "123",
            "date": yesterday
        }
    }, {})
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 0