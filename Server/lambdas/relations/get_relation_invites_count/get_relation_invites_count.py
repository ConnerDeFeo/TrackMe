from rds import fetch_one
import json
from user_auth import get_user_info

# Gets all current proposals (requests or invites) for a user
def get_relation_invites_count(event, context):
    try:
        user_info = get_user_info(event)
        userId = user_info['userId']
        count = fetch_one(
        """
            SELECT COUNT(*) FROM user_relations ur1 
            LEFT JOIN user_relations ur2
            ON ur1.relationId = ur2.userId
            WHERE ur1.relationId = %s
            AND ur2.userId IS NULL
        """, (userId,))
        if not count:
            count = [0]
        return {
            'statusCode': 200,
            'body': json.dumps({"count": count[0]})
        }
    except Exception as e:
        print(f"Error fetching pending proposals: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }