import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from Server.lambdas.athlete.create_athlete.create_athlete import create_athlete

#docker run -p 8000:8000 amazon/dynamodb-local

def test_create_athlete():
    event = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "username": "john.doe",
        "password": "password"
    }
    response = create_athlete(event, {})
    assert response['statusCode'] == 200