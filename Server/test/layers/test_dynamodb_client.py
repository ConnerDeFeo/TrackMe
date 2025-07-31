import sys
import os
import boto3
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from Server.layers.common.python.dynamodb_client import *

test_athlete = {
    'username': 'test', 
    'first_name': 'test', 
    'last_name': 'test', 
    'email': 'test', 
    'password': 'test'
}
table_name = 'athletes_test'

def test_put_item():
    response = put_item(table_name, test_athlete)
    assert response['ResponseMetadata']['HTTPStatusCode'] == 200

    try:
        put_item(table_name, test_athlete, "attribute_not_exists(username)")
        assert False
    except Exception as e:
        assert True #Should throw an exception because username already exists

def test_get_item():
    response = get_item(table_name, {'username': 'test'})
    assert response['Item'] == test_athlete

def test_delete_item():
    response = delete_item(table_name, {'username': 'test'})
    assert response['ResponseMetadata']['HTTPStatusCode'] == 200

    response = get_item(table_name, {'username': 'test'})
    assert response.get('Item') is None