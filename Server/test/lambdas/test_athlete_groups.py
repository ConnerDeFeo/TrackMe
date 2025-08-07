import pytest

from data import TestData
from lambdas.coach.add_athlete_to_group.add_athlete_to_group import add_athlete_to_group
from lambdas.athlete.view_coach_invites.view_coach_invites import view_coach_invites
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.general.get_groups.get_groups import get_groups
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.accept_coach_invite.accept_coach_invite import accept_coach_invite
import json
from rds import execute_file


@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    yield

def test_accept_invite():
    create_coach(TestData.test_coach, {})
    create_group(TestData.test_group, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    accept_coach_invite(TestData.test_accept_coach_invite, {})

    response = add_athlete_to_group(TestData.test_add_athlete_to_group, {})
    assert response['statusCode'] == 200

    #Check if athlete is actually added to group
    response = get_groups(TestData.test_get_group_athlete, {})
    assert response['statusCode'] == 200
    groups = json.loads(response['body'])
    assert len(groups) == 1
    assert 'Test Group' == groups[0][0]

def test_view_coach_invites():
    create_coach(TestData.test_coach, {})
    create_athlete(TestData.test_athlete, {})
    invite_athlete(TestData.test_invite, {})
    event = {
        'body': json.dumps({
            'userId': '1234'
        })
    }

    response = view_coach_invites(event, {})
    assert response['statusCode'] == 200

    invites = json.loads(response['body'])
    assert len(invites) == 1
    print(invites)
    assert invites[0][0] == 'testcoach'