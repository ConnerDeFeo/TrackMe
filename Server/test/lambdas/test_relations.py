import json
import pytest
from lambdas.general.create_user.create_user import create_user
from lambdas.general.add_relation.add_relation import add_relation
from lambdas.general.remove_user_relation.remove_user_relation import remove_user_relation
from lambdas.general.get_mutual_user_relations.get_mutual_user_relations import get_mutual_user_relations
from rds import execute_file, fetch_one, fetch_all
from data import TestData
from datetime import datetime, timezone
from testing_utils import *

date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

# --- Helper Functions ---

@pytest.fixture(autouse=True)
def setup_before_each_test():
    """This will run before each test, setting up a clean database."""
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    yield


# --- Test Cases ---
def test_add_relation_returns_success():
    # Arrange
    event = TestData.test_add_relation_athlete
    create_user(TestData.test_coach, {})
    create_user(TestData.test_athlete, {})

    # Act
    response = add_relation(event, {})

    # Assert
    assert response['statusCode'] == 200
    relation = fetch_one("SELECT * FROM user_relations WHERE userId = %s AND relationId = %s", ("1234", "123"))
    assert relation is not None
    assert relation[0] == "1234"
    assert relation[1] == "123"

def test_remove_user_relation_remove_request_success():
    # Arrange
    create_user(TestData.test_coach, {})
    create_user(TestData.test_athlete, {})
    add_relation(TestData.test_add_relation_athlete, {})
    event = {
        "queryStringParameters": {"targetId": "123"},
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = remove_user_relation(event, {})

    # Assert
    assert response['statusCode'] == 200
    relation = fetch_one("SELECT * FROM user_relations WHERE userId = %s AND relationId = %s", ("1234", "123"))
    assert relation is None

def test_remove_user_relation_decline_request_success():
    # Arrange
    create_user(TestData.test_coach, {})
    create_user(TestData.test_athlete, {})
    add_relation(TestData.test_add_relation_athlete, {})
    event = {
        "queryStringParameters": {"targetId": "1234"},
        "headers": generate_auth_header("123", "Coach", "testcoach")
    }

    # Act
    response = remove_user_relation(event, {})

    # Assert
    assert response['statusCode'] == 200
    relation = fetch_one("SELECT * FROM user_relations WHERE userId = %s AND relationId = %s", ("1234", "123"))
    assert relation is None

def test_remove_user_relation_nonexistent_relation():
    # Arrange
    create_user(TestData.test_coach, {})
    create_user(TestData.test_athlete, {})
    event = {
        "queryStringParameters": {"targetId": "999"},
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = remove_user_relation(event, {})

    # Assert
    assert response['statusCode'] == 200  # Should still return success
    relation = fetch_one("SELECT * FROM user_relations WHERE userId = %s AND relationId = %s", ("1234", "999"))
    assert relation is None  # Confirm no relation exists

def test_remove_user_relation_mutual_sucess():
    # Arrange
    create_user(TestData.test_coach, {})
    create_user(TestData.test_athlete, {})
    add_relation(TestData.test_add_relation_athlete, {})
    add_relation(TestData.test_add_relation_coach, {})
    event = {
        "queryStringParameters": {"targetId": "123"},
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = remove_user_relation(event, {})

    # Assert
    assert response['statusCode'] == 200
    relations = fetch_all("SELECT * FROM user_relations WHERE (userId = %s AND relationId = %s) OR (userId = %s AND relationId = %s)", ("1234", "123", "123", "1234"))
    assert relations is not None
    assert len(relations) == 0  # Both relations should be removed

def test_get_mutual_user_relations_success():
    # Arrange
    create_user(TestData.test_coach, {})
    create_user(TestData.test_athlete, {})
    add_relation(TestData.test_add_relation_athlete, {})
    add_relation(TestData.test_add_relation_coach, {})
    event = {
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = get_mutual_user_relations(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 1
    assert body[0]['relationId'] == "123"
    assert body[0]['username'] == "testcoach"
    assert body[0]['firstName'] == None
    assert body[0]['lastName'] == None
    assert body[0]['accountType'] == 'Coach'