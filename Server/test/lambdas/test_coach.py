import json
import pytest
from lambdas.athlete.input_times.input_times import input_times
from lambdas.coach.remove_context_url.remove_context_url import remove_context_url
from lambdas.general.get_user.get_user import get_user
from lambdas.relations.add_relation.add_relation import add_relation
from lambdas.relations.get_relation_invites_count.get_relation_invites_count import get_relation_invites_count
from lambdas.general.create_user.create_user import create_user
from lambdas.general.update_user_profile.update_user_profile import update_user_profile
from lambdas.coach.add_context_url.add_context_url import add_context_url
from rds import execute_file, fetch_all, fetch_one
from data import TestData
from lambdas.general.mass_input.mass_input import mass_input
from lambdas.general.get_mutual_inputs.get_mutual_inputs import get_mutual_inputs
from datetime import timedelta
from testing_utils import *

base_date = get_base_date()
date = base_date.strftime("%Y-%m-%d")

# --- Helper Functions ---
def setup_base_scenario():
    """Sets up a standard coach, athlete, and their relationship."""
    create_user(TestData.test_coach, {})
    create_user(TestData.test_athlete, {})
    add_relation(TestData.test_add_relation_athlete, {})
    add_relation(TestData.test_add_relation_coach, {})


def generate_athlete(username, userId):
    """Generates a new athlete."""
    create_user({"headers": generate_auth_header(userId, "Athlete", username)}, {})

@pytest.fixture(autouse=True)
def setup_before_each_test():
    """This will run before each test, setting up a clean database."""
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    yield

def test_add_context_url_success():
    # Arrange
    setup_base_scenario()

    # Act
    response = add_context_url(TestData.test_add_context_url, {})

    # Assert
    assert response['statusCode'] == 200
    url_id = json.loads(response['body'])
    assert url_id is not None
    url = fetch_one("SELECT contextUrl FROM context_urls WHERE coachId = %s and id = %s", ("123", url_id))
    assert url is not None
    assert url[0] == "http://example.com/profile"

def test_remove_context_url_returns_success():
    # Arrange
    setup_base_scenario()
    event = {
        "headers": generate_auth_header("123", "Coach", "testcoach"),
        "queryStringParameters": {
            "urlId": 1
        }
    }
    add_context_url(TestData.test_add_context_url, {})

    # Act
    response = remove_context_url(event, {})

    # Assert
    assert response['statusCode'] == 204
    url = fetch_one("SELECT contextUrl FROM context_urls WHERE coachId = %s and id = %s", ("123", 1))
    assert url is None
