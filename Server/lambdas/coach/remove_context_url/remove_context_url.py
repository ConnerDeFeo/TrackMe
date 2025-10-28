import json
from rds import execute_commit
from user_auth import get_user_info, post_auth_header
from datetime import datetime, timezone

def remove_context_url(event, context):
    auth_header = post_auth_header()
    query_params = event.get('queryStringParameters', {})

    try:
        user_info = get_user_info(event)
        coach_id = user_info['userId']
        url_id = query_params['urlId']

        # delete from db
        execute_commit("""
            DELETE FROM context_urls
            WHERE coachId = %s AND id=%s
        """, (coach_id, url_id))

        return {
            'statusCode': 204,
            'body': json.dumps({'message': 'Context URL removed successfully'}),
            'headers': auth_header
        }
    except Exception as e:
        print(f"Error removing context URL: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to remove context URL'}),
            'headers': auth_header
        }