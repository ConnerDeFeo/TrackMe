import json
import pytest
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.athlete.input_times.input_times import input_times
from lambdas.coach.add_athlete_to_group.add_athlete_to_group import add_athlete_to_group
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from rds import execute_file
from data import TestData
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.athlete.view_input_history.view_input_history import view_input_history
from datetime import datetime, timedelta, timezone
    
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
            "groupId": 2
        })
    }, {})
    yield

def test_view_input_history():
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
            "date": date,
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
            "date": yesterday,
            'inputs': [
                {
                    'distance': 7,
                    'time': 8
                }
            ]
        })
    }, {})

    response =  view_input_history({
        "queryStringParameters": {
            "athleteId": "1234"
        }
    }, {})
    assert response['statusCode'] == 200
    input_history = json.loads(response['body'])
    assert len(input_history) == 2 # two dates with inputs recorded

    inputs_yesterday = input_history[yesterday]
    assert inputs_yesterday['1']['inputs'] == [{'distance': 1, 'time': 2.0}]
    assert inputs_yesterday['1']['name'] == 'Test Group'
    assert inputs_yesterday['2']['inputs'] == [{'distance': 7, 'time': 8.0}]
    assert inputs_yesterday['2']['name'] == 'Test Group 2'
    
    inputs_today = input_history[date]
    assert inputs_today['1']['inputs'] == [{'distance': 100, 'time': 10.8}, {'distance': 200, 'time': 30}]
    assert inputs_today['1']['name'] == 'Test Group'
    assert inputs_today['2']['inputs'] == [{'distance': 3, 'time': 4.0}, {'distance': 5, 'time': 6.0}]
    assert inputs_today['2']['name'] == 'Test Group 2'
    
def search_input_history_date():
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
            "date": (datetime.now(timezone.utc) - timedelta(days=2)).strftime("%Y-%m-%d"),
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
            "date": (datetime.now(timezone.utc) - timedelta(days=3)).strftime("%Y-%m-%d"),
            'inputs': [
                {
                    'distance': 7,
                    'time': 8
                }
            ]
        })
    }, {})
