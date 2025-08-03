import pytest
from rds import execute_file
from lambdas.athlete.view_workout_athlete.view_workout_athlete import view_workout_athlete


@pytest.fixture(autouse=True)
def setup_before_each_test(): #This will run before each test
    print("Setting up before test...")
    execute_file('dev-setup/setup.sql')
    yield

def test_view_workout_athlete():
    pass