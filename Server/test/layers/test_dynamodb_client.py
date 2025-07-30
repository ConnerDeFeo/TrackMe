import sys
import os
import boto3
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from Server.layers.common.python.dynamodb_client import *

def test_put_item():
    response = put_item('athletes', {
        'username': 'test', 
        'first_name': 'test', 
        'last_name': 'test', 
        'email': 'test', 
        'password': 'test'
    })
    assert response['ResponseMetadata']['HTTPStatusCode'] == 200

def test_get_item():
    response = get_item('athletes', {'username': 'test'})
    assert response['Item'] == {
        'username': 'test', 
        'first_name': 'test', 
        'last_name': 'test', 
        'email': 'test', 
        'password': 'test'
    }

def test_delete_item():
    response = delete_item('athletes', {'username': 'test'})
    assert response['ResponseMetadata']['HTTPStatusCode'] == 200

    response = get_item('athletes', {'username': 'test'})
    assert response['Item'] is None