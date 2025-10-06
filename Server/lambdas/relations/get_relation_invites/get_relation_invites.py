import json
from rds import fetch_all
from user_auth import get_user_info, get_auth_header

def get_relation_invites(event, context):
    auth_header = get_auth_header()

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']

        # Fetch relation invites from db   
        invites = fetch_all(
        """
            SELECT ur.userId, u.username, u.firstName, u.lastName, u.accountType
            FROM user_relations ur
            JOIN users u ON ur.userId = u.userId
            LEFT JOIN user_relations ur2 
                ON ur.userId = ur2.relationId 
                AND ur.relationId = ur2.userId
            WHERE ur.relationId = %s 
            AND ur2.userId IS NULL
        """,(user_id,)
        ) or []
        return {
            'statusCode': 200,
            'body': json.dumps(invites),
            'headers': auth_header
        }
    except Exception as e:
        print(f"Error fetching relation invites: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': auth_header
        }