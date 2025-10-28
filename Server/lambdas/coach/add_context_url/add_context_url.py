import json
from rds import execute_commit_fetch_one
from user_auth import get_user_info, post_auth_header
from datetime import datetime, timezone

def add_context_url(event, context):
    auth_header = post_auth_header()
    body = json.loads(event['body'])

    try:
        user_info = get_user_info(event)
        coach_id = user_info['userId']
        context_url = body['contextUrl']
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        # insert into db
        url_id = execute_commit_fetch_one(
        """
            INSERT INTO context_urls (coachId, contextUrl, date)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (coach_id, context_url, date))
        if url_id:
            return {
                'statusCode': 200,
                'body': json.dumps(url_id[0]),
                'headers': auth_header
            }
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to add context URL'}),
            'headers': auth_header
        }
    except Exception as e:
        print(f"Error adding context URL: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to add context URL'}),
            'headers': auth_header
        }