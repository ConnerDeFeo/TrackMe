import json
from user_auth import get_user_info, post_auth_header
from rds import execute_commit


def upload_video(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        title = body['title']
        description = body.get('description', '')
        videoUrl = body['videoUrl']

        execute_commit(
            """
                INSERT INTO video_uploads (userId, videoUrl, title, description)
                VALUES (%s, %s, %s, %s)
            """,
            (user_id, videoUrl, title, description)
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Video uploaded successfully'}),
            'headers': auth_header
        }

    except Exception as e:
        print(f"Authentication Error: {e}")
        return {
            'statusCode': 401,
            'body': json.dumps({'message': 'Unauthorized'}),
            'headers': auth_header
        }