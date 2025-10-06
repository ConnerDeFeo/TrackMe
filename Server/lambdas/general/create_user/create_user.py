import json
from rds import execute_commit
from user_auth import get_user_info, post_auth_header

def create_user(event, context):
    auth_header = post_auth_header()

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        account_type = user_info['accountType']
        username = user_info['username']

        # Insert user into the users table
        execute_commit(
            "INSERT INTO users (userId, username, accountType) VALUES (%s, %s, %s)",
            (user_id, username, account_type)
        )

        return {
            'statusCode': 201,
            'body': json.dumps({'message': 'User created successfully'}),
            'headers': auth_header
        }

    except Exception as e:
        return {
            'statusCode': 401,
            'body': json.dumps({'message': str(e)}),
            'headers': auth_header
        }
