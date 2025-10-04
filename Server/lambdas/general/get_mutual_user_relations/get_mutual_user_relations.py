import json
from user_auth import get_user_info
from rds import fetch_all

def get_mutual_user_relations(event, context):
    
    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']

        # Fetch mutual relations from db   
        relations = fetch_all(
        """
            SELECT ur.relationId, u.username, u.firstName, u.lastName, u.accountType
            FROM user_relations ur
            JOIN user_relations ur2 ON ur.relationId = ur2.userId
            JOIN users u ON ur.relationId = u.userId
            WHERE ur.userId = %s AND ur2.relationId = %s
        """,(user_id, user_id)
        )
        
        if relations:
            mutual_relations = [{'relationId': r[0], 'username': r[1], 'firstName': r[2], 'lastName': r[3], 'accountType': r[4]} for r in relations]
            return {
                'statusCode': 200,
                'body': json.dumps(mutual_relations)
            }
        return {
            'statusCode': 200,
            'body': json.dumps([])
        }
    except Exception as e:
        print(f"Error fetching mutual user relations: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }