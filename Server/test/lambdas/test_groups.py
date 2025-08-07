import json
import pytest
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.general.get_groups.get_groups import get_groups
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
from lambdas.coach.add_athlete_to_group.add_athlete_to_group import add_athlete_to_group
from rds import execute_file
from data import TestData

@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    create_group(TestData.test_group, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})
    add_athlete_to_group(TestData.test_add_athlete_to_group, {})
    yield

def test_get_groups_athlete():
    response = get_groups(TestData.test_get_group_athlete, {})
    assert response['statusCode'] == 200

    groups = json.loads(response['body'])
    assert len(groups) == 1
    assert groups[0][0] == 'Test Group'
    assert groups[0][1] == 1

def test_get_groups_coach():
    create_group({
        "body": json.dumps({
            "groupName": "Test Group 2",
            "userId": "123"
        })
    }, {})
    response = get_groups(TestData.test_get_group_coach, {})
    assert response['statusCode'] == 200

    groups = json.loads(response['body'])
    assert len(groups) == 2
    assert groups[0][0] == 'Test Group'
    assert groups[0][1] == 1
    assert groups[1][0] == 'Test Group 2'
    assert groups[1][1] == 2