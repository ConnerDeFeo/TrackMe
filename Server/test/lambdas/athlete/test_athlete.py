import sys
import os
import json
from Server.layers.common.python.dynamodb_client import delete_item

# Add the Server directory to Python path for local testing
server_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../'))
sys.path.insert(0, server_root)

# Add the layers directory to Python path for local testing
layers_root = os.path.join(server_root, 'layers')
sys.path.insert(0, layers_root)

from Server.lambdas.athlete.create_athlete.create_athlete import create_athlete

def test_create_athlete():
    #Send a valid JSON event
    event = {
        "body": json.dumps({
            "userId": "123",
        })
    }
    response = create_athlete(event, {})
    assert response['statusCode'] == 200

    #Clean up athlete
    delete_item('athletes', {'userId': '123'})