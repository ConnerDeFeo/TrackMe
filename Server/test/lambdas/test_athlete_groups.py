import pytest

from data import TestData
from lambdas.coach.add_athlete_to_group.add_athlete_to_group import add_athlete_to_group
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.general.get_groups.get_groups import get_groups
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
import json
from rds import execute_file
from testing_utils import *


@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('./setup.sql')
    yield

def setup_coach_athlete_relationship():
    """Creates a coach and an athlete and establishes a relationship between them."""
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})

def test_add_athlete_to_group_and_verify_access():
    # Arrange
    # 1. Create a coach and an athlete with an established relationship
    setup_coach_athlete_relationship()
    
    # 2. Create a group for the coach
    create_group(TestData.test_group, {})
    
    # 3. Define the event to add the athlete to the group
    add_event = TestData.test_add_athlete_to_group

    # Act
    # 4. Add the athlete to the group
    add_response = add_athlete_to_group(add_event, {})

    # Assert
    # 5. Verify the add operation was successful
    assert add_response['statusCode'] == 200

    # 6. Verify the athlete can now see the group they were added to
    get_groups_event = TestData.test_get_group_athlete
    get_groups_response = get_groups(get_groups_event, {})
    
    assert get_groups_response['statusCode'] == 200
    groups = json.loads(get_groups_response['body'])
    assert len(groups) == 1
    assert groups[0][0] == 'Test Group'
