import json
from rds import execute_commit_many

def input_group_time(event, context):
    body = json.loads(event['body'])
    pass