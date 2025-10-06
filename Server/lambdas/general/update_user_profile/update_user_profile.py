import json
from user_auth import get_user_info
from rds import execute_commit, post_auth_header

def update_user_profile(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        bio = body.get('bio', '')
        first_name = body.get('firstName', '')
        last_name = body.get('lastName', '')

        # Update user profile in the database
        execute_commit(
        '''
            UPDATE users
            SET bio = %s, firstName = %s, lastName = %s
            WHERE userId = %s
        ''', (bio, first_name, last_name, user_id))

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'User profile updated successfully'}),
            'headers': auth_header
        }
    except Exception as e:
        print(f"Authentication error: {e}")
        return {
            'statusCode': 401,
            'body': json.dumps({'message': str(e)}),
            'headers': auth_header
        }