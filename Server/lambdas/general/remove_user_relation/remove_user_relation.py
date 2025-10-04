import json
from user_auth import get_user_info
from rds import execute_commit

def remove_user_relation(event, context):
    body = json.loads(event['body'])

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        targetId = body['targetId']

        # Remove relation from db   
        execute_commit(
        """
            DELETE FROM user_relations WHERE userId = %s AND relationId = %s
            OR userId = %s AND relationId = %s
        """,(user_id, targetId, targetId, user_id)
        )
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Relation removed successfully'})
        }
    except Exception as e:
        print(f"Error removing user relation: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }