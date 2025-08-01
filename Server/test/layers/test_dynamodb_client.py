import sys
import os
import boto3
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from Server.layers.common.python.dynamodb_client import *

test_athlete = {
    'userId': '1234'
}
table_name = 'athletes_test'

def test_put_item():    
    response = put_item(table_name, test_athlete)
    assert response['ResponseMetadata']['HTTPStatusCode'] == 200

    try:
        put_item(table_name, test_athlete, "attribute_not_exists(userId)")
        assert False
    except Exception as e:
        assert True #Should throw an exception because userId already exists

def test_get_item():
    response = get_item(table_name, {'userId': '1234'})
    assert response['Item'] == test_athlete

def test_delete_item():
    response = delete_item(table_name, {'userId': '1234'})
    assert response['ResponseMetadata']['HTTPStatusCode'] == 200

    response = get_item(table_name, {'userId': '1234'}) 
    assert response.get('Item') is None