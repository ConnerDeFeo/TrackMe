import sys
import os
import json

# Add the Server directory to Python path for local testing
server_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../'))
sys.path.insert(0, server_root)

# Add the layers directory to Python path for local testing
layers_root = os.path.join(server_root, 'layers')
sys.path.insert(0, layers_root)

from Server.lambdas.athlete.create_athlete.create_athlete import create_athlete

def test_create_athlete():
    # Load the test data
    test_data = json.load(open('events/create_athlete.json'))
    # Create an AWS API Gateway event structure
    event = {
        'body': json.dumps(test_data)
    }
    
    response = create_athlete(event, {})
    assert response['statusCode'] == 200