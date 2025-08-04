import pytest

from data import test_coach, test_group, test_athlete, test_invite, test_accept_group_invite
from lambdas.athlete.view_group_invites.view_group_invites import view_group_invites
from lambdas.coach.create_coach.create_coach import create_coach
from lambdas.general.get_group.get_group import get_group
from lambdas.coach.create_group.create_group import create_group
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from lambdas.coach.invite_athlete.invite_athlete import invite_athlete
from lambdas.athlete.accept_group_invite.accept_group_invite import accept_group_invite
import json
from rds import execute_file


@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    yield

def test_accept_invite():
    create_coach(test_coach, {})
    create_group(test_group, {})
    create_athlete(test_athlete, {})
    invite_athlete(test_invite, {})
    response = accept_group_invite(test_accept_group_invite, {})
    assert response['statusCode'] == 200

    #Check if athlete is actually added to group
    response = get_group(test_group, {})
    assert response['statusCode'] == 200
    group = json.loads(response['body'])
    assert len(group) == 1
    assert 'test_athlete' == group[0][0]

def test_view_group_invites():
    create_coach(test_coach, {})
    create_group(test_group, {})
    create_athlete(test_athlete, {})
    invite_athlete(test_invite, {})
    event = {
        'body': json.dumps({
            'userId': '1234'
        })
    }

    response = view_group_invites(event, {})
    assert response['statusCode'] == 200

    invites = json.loads(response['body'])
    assert len(invites) == 1
    print(invites)
    assert invites[0][0] == 'Test Group'
    assert invites[0][1] == 'testcoach'