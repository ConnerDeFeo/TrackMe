import json
from user_auth import get_user_info, get_auth_header
from rds import fetch_all

def get_mutual_athletes(event, context):
    auth_header = get_auth_header()
    
    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']

        # Fetch mutual relations from db   
        relations = fetch_all(
        """
            SELECT ur.relationId, u.username, u.firstName, u.lastName, u.profilePicUrl
            FROM user_relations ur
            JOIN user_relations ur2 ON ur.relationId = ur2.userId
            JOIN users u ON ur.relationId = u.userId
            WHERE ur.userId = %s AND ur2.relationId = %s
            AND u.accountType = 'Athlete'
        """,(user_id, user_id)
        )
        
        if relations:
            mutual_relations = [{'relationId': r[0], 'username': r[1], 'firstName': r[2], 'lastName': r[3], 'profilePicUrl': r[4]} for r in relations]
            return {
                'statusCode': 200,
                'body': json.dumps(mutual_relations),
                'headers': auth_header
            }
        return {
            'statusCode': 200,
            'body': json.dumps([]),
            'headers': auth_header
        }
    except Exception as e:
        print(f"Error fetching mutual user relations: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': auth_header
        }