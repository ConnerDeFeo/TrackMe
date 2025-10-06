import json
from rds import fetch_all
from user_auth import get_auth_header

#For a given group, gets all althetes
def get_athletes_for_group(event, context):
    query_params = event['queryStringParameters']
    auth_header = get_auth_header()
    
    try:
        group_id = query_params.get('groupId')
        
        #Get athletes
        athletes = fetch_all(
        """
            SELECT u.userId, u.username, u.firstName, u.lastName
            FROM users u
            JOIN athlete_groups ag ON u.userId = ag.athleteId
            JOIN groups g ON ag.groupId = g.id
            WHERE ag.groupId = %s
            AND ag.removed = FALSE
            AND g.deleted = FALSE
        """, (group_id,))

        if(athletes):
            return {
                "statusCode": 200,
                "body": json.dumps(athletes),
                "headers": auth_header
            }
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "No athletes found"}),
            "headers": auth_header
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": auth_header
        }

