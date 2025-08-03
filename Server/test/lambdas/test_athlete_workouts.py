import json
import pytest
from lambdas.athlete import accept_group_invite
from lambdas.athlete.accept_group_invite.accept_group_invite import accept_group_invite
from lambdas.coach import create_workout
from lambdas.coach.create_group.create_group import create_group
from lambdas.coach.create_workout.create_workout import create_workout
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.coach.assign_group_workout.assign_group_workout import assign_group_workout
from rds import execute_file
from lambdas.athlete.view_workout_athlete.view_workout_athlete import view_workout_athlete
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.create_coach.create_coach import create_coach
from data import test_athlete, test_coach, test_group, test_workout, test_invite, test_accept_group_invite
from datetime import datetime, timezone 


@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    yield

def test_view_workout_athlete():
    create_athlete(test_athlete, {})
    create_coach(test_coach, {})
    create_group(test_group, {})
    invite_athlete(test_invite, {})
    accept_group_invite(test_accept_group_invite, {})
    create_workout(test_workout, {})
    
    # Assign the workout to the group
    assign_workout_event = {
        "body": json.dumps({
            "title": "Test Workout",
            "userId": "123",
            "groupName": "Test Group"
        })
    }
    assign_group_workout(assign_workout_event, {})

    event = {
        "body": json.dumps({
            "groupName": "Test Group",
            "coachId": "123",
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d")
        })
    }

    response = view_workout_athlete(event, {})

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['coach_id'] == '123'
    assert body['title'] == 'Test Workout'
    assert body['description'] == 'This is a test workout'
    assert len(body['excersies']) == 3
