import json
import pytest
from lambdas.relations.get_mutual_athletes.get_mutual_athletes import get_mutual_athletes
from lambdas.general.create_user.create_user import create_user
from lambdas.relations.add_relation.add_relation import add_relation
from lambdas.relations.get_relation_invites.get_relation_invites import get_relation_invites
from lambdas.relations.remove_user_relation.remove_user_relation import remove_user_relation
from lambdas.relations.get_mutual_user_relations.get_mutual_user_relations import get_mutual_user_relations
from lambdas.relations.search_user_relation.search_user_relation import search_user_relation
from rds import execute_file, fetch_one, fetch_all
from data import TestData
from datetime import datetime, timezone
from testing_utils import *

base_date = get_base_date()
date = base_date.strftime("%Y-%m-%d")

# --- Helper Functions ---

@pytest.fixture(autouse=True)
def setup_before_each_test():
    """This will run before each test, setting up a clean database."""
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    yield

def setup_base_scenerio():
    create_user(TestData.test_coach, {})
    create_user(TestData.test_athlete, {})
    add_relation(TestData.test_add_relation_athlete, {})
    add_relation(TestData.test_add_relation_coach, {})

def setup_search_scenario():
    # Two way connection to athlete
    setup_base_scenerio()

    # one way connection from athlete to coach
    create_user({
        "headers": generate_auth_header("9999", "Coach", "23coachpending123"),
    },{})
    add_relation({
        "body": json.dumps({"relationId": "9999"}),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete"),
    },{})

    # One way connection from coach to athlete
    create_user({
        "headers": generate_auth_header("9998", "Coach", "coachawaiting1234"),
    },{})
    add_relation({
        "body": json.dumps({"relationId": "1234"}),
        "headers": generate_auth_header("9998", "Coach", "coachawaiting1234"),
    },{})

    # No connection
    create_user({
        "headers": generate_auth_header("9997", "Coach", "coachnotadded"),
    },{})

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
    setup_base_scenerio()
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
    setup_base_scenerio()
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

def test_get_relation_invites_success():
    # Arrange
    setup_base_scenerio()
    create_user({
        "headers": generate_auth_header("9999", "Coach", "othercoach"),
    },{})
    add_relation({
        "body": json.dumps({"relationId": "1234"}),
        "headers": generate_auth_header("9999", "Coach", "testcoach"),
    },{})
    
    event = {
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = get_relation_invites(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 1

def test_search_user_relation_empty_string_success():
    # Arrange
    setup_search_scenario()
    event = {
        "queryStringParameters": {"searchTerm": ""},
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = search_user_relation(event, {
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    })

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 4
    status_map = {user[1]: user[5] for user in body}
    assert status_map['testcoach'] == 'added'
    assert status_map['23coachpending123'] == 'pending'
    assert status_map['coachawaiting1234'] == 'awaiting response'
    assert status_map['coachnotadded'] == 'not added'

def test_search_user_relation_specific_term_success():
    # Arrange
    setup_search_scenario()
    event = {
        "queryStringParameters": {"searchTerm": "coachpending"},
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = search_user_relation(event, {
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    })

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 1
    assert body[0][1] == '23coachpending123'
    assert body[0][5] == 'pending'

def test_search_user_relation_generic_success():
    # Arrange
    setup_search_scenario()
    event = {
        "queryStringParameters": {"searchTerm": "coach"},
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }

    # Act
    response = search_user_relation(event, {
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    })

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 4
    status_map = {user[1]: user[5] for user in body}
    assert status_map['testcoach'] == 'added'
    assert status_map['23coachpending123'] == 'pending'
    assert status_map['coachawaiting1234'] == 'awaiting response'
    assert status_map['coachnotadded'] == 'not added'

def test_get_mutual_athletes_no_mutuals():
    # Arrange
    create_user(TestData.test_athlete, {})
    create_user({
        "headers": generate_auth_header("9999", "Athlete", "otherathlete"),
    },{})
    add_relation({
        "body": json.dumps({"relationId": "9999"}),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete"),
    },{})
    event = {
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }
    
    # Act
    response = get_mutual_athletes(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 0

def test_get_mutual_athletes_with_mutuals():
    # Arrange
    create_user(TestData.test_athlete, {})
    create_user(TestData.test_coach, {})
    add_relation(TestData.test_add_relation_athlete, {})
    add_relation(TestData.test_add_relation_coach, {})
    create_user({
        "headers": generate_auth_header("9999", "Athlete", "otherathlete"),
    },{})
    add_relation({
        "body": json.dumps({"relationId": "9999"}),
        "headers": generate_auth_header("1234", "Athlete", "test_athlete"),
    },{})
    add_relation({
        "body": json.dumps({"relationId": "1234"}),
        "headers": generate_auth_header("9999", "Athlete", "otherathlete"),
    },{})
    event = {
        "headers": generate_auth_header("1234", "Athlete", "test_athlete")
    }
    
    # Act
    response = get_mutual_athletes(event, {})

    # Assert
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body) == 1
    assert body[0]['relationId'] == '9999'
    assert body[0]['username'] == 'otherathlete'