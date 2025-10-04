import pytest
from lambdas.coach.create_coach.create_coach import create_coach
from rds import execute_file, fetch_one
from testing_utils import *
from data import TestData


@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    yield
def test_create_coach_success():
    # Arrange
    event = TestData.test_coach

    # Act
    response = create_coach(event, {})
    
    # Assert
    assert response['statusCode'] == 200
    coach = fetch_one("SELECT userId, username FROM users WHERE userId=%s AND accountType='coach'", ('123',))
    assert coach is not None
    assert coach[0] == '123'
    assert coach[1] == 'testcoach'