from rds import execute_file
import pytest
from data import TestData
from lambdas.athlete.create_athlete.create_athlete import create_athlete
from rds import fetch_one


@pytest.fixture(autouse=True)
def setup_before_each_test():
    print("Setting up before test...")
    execute_file('dev-setup/removeTables.sql')
    execute_file('./setup.sql')
    yield

def test_create_athlete_returns_success():
    # Arrange
    event = TestData.test_athlete

    # Act
    response = create_athlete(event, {})

    # Assert
    assert response['statusCode'] == 200
    data = fetch_one("SELECT * FROM users WHERE userId = '1234' AND accountType = 'athlete'")
    assert data is not None
