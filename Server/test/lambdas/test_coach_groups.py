import pytest

from lambdas.coach.delete_group.delete_group import delete_group
from lambdas.coach.add_athlete_to_group.add_athlete_to_group import add_athlete_to_group
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.get_absent_group_athletes.get_absent_group_athletes import get_absent_group_athletes
from lambdas.general.get_athletes_for_group.get_athletes_for_group import get_athletes_for_group
from lambdas.coach.assign_group_workout.assign_group_workout import assign_group_workout
from lambdas.general.add_relation.add_relation import add_relation
import json
from data import TestData
from lambdas.coach.remove_group_athlete.remove_group_athlete import remove_group_athlete
from rds import execute_file, fetch_one
from testing_utils import *

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    create_coach(TestData.test_coach, {})
    yield

def generate_athlete(username, userId):
    create_athlete( {
        "body": json.dumps({
            "userId": userId,
            "username": username
        })
    },{})

def setup_athlete_with_group():
    """Set up a coach, athlete, group, and link them."""
    create_group(TestData.test_group, {})
    create_athlete(TestData.test_athlete, {})
    add_relation(TestData.test_add_relation_athlete, {})
    add_relation(TestData.test_add_relation_coach, {})
    add_athlete_to_group(TestData.test_add_athlete_to_group, {})

def setup_absent_athletes_scenario():
    """Set up a scenario with one athlete in a group and one not."""
    setup_athlete_with_group()
    create_athlete({
        "headers": generate_auth_header("1235", "Athlete", "testathlete2"),
    }, {})
    add_relation({
        "body": json.dumps({"relationId": "1235"}),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }, {})
    add_relation({
        "body": json.dumps({"relationId": "123"}),
        "headers": generate_auth_header("1235", "Athlete", "testathlete2")
    }, {})

def test_create_group_returns_success():
    # Arrange
    event = TestData.test_group

    # Act
    response = create_group(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_create_group_returns_correct_group_id():
    # Arrange
    event = TestData.test_group

    # Act
    response = create_group(event, {})

    # Assert
    group_id = json.loads(response['body'])
    assert group_id['groupId'] == 1


def test_add_athlete_to_group_returns_success():
    # Arrange
    create_group(TestData.test_group, {})
    create_athlete(TestData.test_athlete, {})
    add_relation(TestData.test_add_relation_athlete, {})
    add_relation(TestData.test_add_relation_coach, {})
    event = {
        "body": json.dumps({"athleteId": "1234", "groupId": "1"}),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = add_athlete_to_group(event, {})
    debug_table()
    # Assert
    assert response['statusCode'] == 200

def test_add_athlete_to_group_persists_relationship():
    # Arrange
    create_group(TestData.test_group, {})
    create_athlete(TestData.test_athlete, {})
    add_relation(TestData.test_add_relation_athlete, {})
    add_relation(TestData.test_add_relation_coach, {})
    event = {
        "body": json.dumps({"athleteId": "1234", "groupId": "1"}),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    add_athlete_to_group(event, {})

    # Assert
    response = fetch_one("SELECT * FROM athlete_groups WHERE athleteId = %s AND groupId = %s", ("1234", "1"))
    assert response is not None
    assert response[0] == "1234"
    assert response[1] == 1

def test_get_absent_group_athletes_returns_success():
    # Arrange
    setup_absent_athletes_scenario()
    event = {
        "queryStringParameters": {"groupId": "1"},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_absent_group_athletes(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_get_absent_group_athletes_returns_correct_athletes():
    # Arrange
    setup_absent_athletes_scenario()
    event = {
        "queryStringParameters": {"groupId": "1"},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_absent_group_athletes(event, {})

    # Assert
    body = json.loads(response['body'])
    assert len(body) == 1
    assert body[0] == ["1235", "testathlete2"]

def test_remove_group_athlete_returns_success():
    # Arrange
    setup_athlete_with_group()
    event = {
        "queryStringParameters": {"groupId": "1", "athleteId": "1234"},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = remove_group_athlete(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_remove_group_athlete_soft_deletes_relationship():
    # Arrange
    setup_athlete_with_group()
    event = {
        "queryStringParameters": {"groupId": "1", "athleteId": "1234"},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    remove_group_athlete(event, {})

    # Assert
    response = get_athletes_for_group({"queryStringParameters": {"groupId": "1"}}, {})
    assert response['statusCode'] == 404

    absent_event = {
        "queryStringParameters": {"groupId": "1"},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }
    response = get_absent_group_athletes(absent_event, {})
    assert response['statusCode'] == 200
    assert json.loads(response['body']) == [['1234', "test_athlete"]]

def test_delete_group_returns_success():
    # Arrange
    create_group(TestData.test_group, {})
    event = {
        "queryStringParameters": {"groupId": 1},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = delete_group(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_delete_group_soft_deletes_group():
    # Arrange
    create_group(TestData.test_group, {})
    event = {
        "queryStringParameters": {"groupId": 1},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    delete_group(event, {})

    # Assert
    response = fetch_one("SELECT * FROM groups WHERE id = %s", (1,))
    assert response is not None
    assert response[4] is True

def test_assign_group_workout_returns_success():
    # Arrange
    setup_athlete_with_group()
    event = {
        "body": json.dumps({
            "groupId": 1,
            "title": "Test Workout",
            "description": "This is a test workout",
            "sections": [{"name": "Push Ups", "sets": 3, "reps": 10}]
        }),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = assign_group_workout(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_assign_group_workout_creates_workout_and_assignment():
    # Arrange
    setup_athlete_with_group()
    event = {
        "body": json.dumps({
            "groupId": 1,
            "title": "Test Workout",
            "description": "This is a test workout",
            "sections": [{"name": "Push Ups", "sets": 3, "reps": 10}]
        }),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = assign_group_workout(event, {})

    # Assert
    body = json.loads(response['body'])
    assert body['workout_id'] == 1

    group_workout = fetch_one("SELECT * FROM group_workouts WHERE groupId = %s AND workoutId = %s", (1, 1))
    assert group_workout is not None

    workout = fetch_one("SELECT isTemplate, sections FROM workouts WHERE id = %s", (1,))
    assert workout is not None
    assert workout[0] is False
    assert workout[1] == [{"name": "Push Ups", "sets": 3, "reps": 10}]