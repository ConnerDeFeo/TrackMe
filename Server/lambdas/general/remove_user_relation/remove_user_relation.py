import json
from user_auth import get_user_info
from rds import execute_commit

def remove_user_relation(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        account_type = user_info['accountType']
        targetId = query_params['targetId']

        # Remove relation from db   
        execute_commit(
        """
            DELETE FROM user_relations WHERE userId = %s AND relationId = %s
            OR userId = %s AND relationId = %s
        """,(user_id, targetId, targetId, user_id)
        )

        # Remove target or user from any groups they are in together where one is the coach/owner
        execute_commit(
        """
            UPDATE athlete_groups ag
            SET removed = TRUE
            FROM groups g
            JOIN users u ON g.coachId = u.userId
            WHERE ag.groupId = g.id
            AND ((ag.athleteId = %s AND g.coachId = %s)
                OR (g.coachId = %s AND ag.athleteId = %s));
        """,(targetId, user_id, targetId, user_id)
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