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
        execute_commit(
        """
            DELETE FROM context_urls cu
            WHERE cu.id = %s 
            AND (
                cu.coachId = %s
                OR EXISTS (
                    SELECT 1 
                    FROM user_relations ur1
                    JOIN user_relations ur2 
                        ON ur1.relationId = ur2.userId 
                        AND ur2.relationId = ur1.userId
                    WHERE ur1.userId = %s 
                    AND ur2.userId = cu.coachId
                )
            )
        """, (url_id, coach_id, coach_id))

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