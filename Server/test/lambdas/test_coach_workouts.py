import json
import pytest
from lambdas.coach.create_group.create_group import create_group
from lambdas.workout.create_workout_template.create_workout_template import create_workout_template
from lambdas.workout.delete_workout_template.delete_workout_template import delete_workout_template
from lambdas.workout.get_workout_templates.get_workout_templates import get_workout_templates
from lambdas.workout.assign_group_workout_template.assign_group_workout_template import assign_group_workout_template
from lambdas.workout.get_workout.get_workout import get_workout
from lambdas.general.create_user.create_user import create_user
from data import TestData
from rds import execute_file, fetch_one
from datetime import datetime, timezone 
from testing_utils import *

date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    create_user(TestData.test_coach, {})
    create_group(TestData.test_group, {})
    yield

def setup_assigned_template():
    """Create and assign a workout template to a group."""
    create_workout_template(TestData.test_workout, {})
    create_group(TestData.test_group, {})
    event = {
        "body": json.dumps({
            "workoutId": 1,
            "groupId": 1
        }),
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }
    return event

def test_create_workout_template_returns_success():
    # Arrange
    event = TestData.test_workout

    # Act
    response = create_workout_template(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['workout_id'] == 1

def test_create_workout_template_persists_as_template():
    # Arrange
    event = TestData.test_workout

    # Act
    create_workout_template(event, {})

    # Assert
    response = fetch_one("SELECT isTemplate FROM workouts WHERE id = %s", (1,))
    assert response is not None
    assert response[0] is True

def test_get_workout_templates_returns_success():
    # Arrange
    create_workout_template(TestData.test_workout, {})
    event = {
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_workout_templates(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_get_workout_templates_returns_correct_templates():
    # Arrange
    create_workout_template(TestData.test_workout, {})
    event = {
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_workout_templates(event, {})

    # Assert
    body = json.loads(response['body'])
    print(f"Retrieved workout templates: {body}")  # Debug print
    assert len(body) == 1
    workout = body[0]
    assert workout['workoutId'] == 1
    assert workout['title'] == "Test Workout"
    assert workout['description'] == "This is a test workout"
    assert len(workout['sections']) == 3

def test_delete_workout_template_returns_success():
    # Arrange
    create_workout_template(TestData.test_workout, {})
    event = {
        "queryStringParameters": {"workoutId": 1},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = delete_workout_template(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_delete_workout_template_sets_isTemplate_false():
    # Arrange
    create_workout_template(TestData.test_workout, {})
    event = {
        "queryStringParameters": {"workoutId": 1},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    delete_workout_template(event, {})

    # Assert
    response = fetch_one("SELECT isTemplate FROM workouts WHERE id = %s", (1,))
    assert response is not None
    assert response[0] is False

def test_assign_group_workout_template_returns_success():
    # Arrange
    event = setup_assigned_template()

    # Act
    response = assign_group_workout_template(event, {})

    # Assert
    assert response['statusCode'] == 200

def test_assign_group_workout_template_creates_assignment():
    # Arrange
    event = setup_assigned_template()

    # Act
    assign_group_workout_template(event, {})

    # Assert
    response = fetch_one("SELECT * FROM group_workouts WHERE groupId = %s AND workoutId = %s", (1, 1))
    assert response is not None

def test_get_workout_returns_success():
    # Arrange
    create_workout_template(TestData.test_workout, {})
    event = {
        "queryStringParameters": {"workoutId": 1},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = get_workout(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['workoutId'] == 1
    assert body['title'] == "Test Workout"
    assert body['description'] == "This is a test workout"
    assert len(body['sections']) == 3