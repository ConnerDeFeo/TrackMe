import json
from rds import fetch_all

#For a given group, gets all althetes
def get_athletes_for_group(event, context):
    query_params = event['queryStringParameters']
    
    try:
        group_id = query_params.get('groupId')
        
        #Get athletes
        athletes = fetch_all(
        """
            SELECT a.userId, a.username, a.firstName, a.lastName
            FROM athletes a
            JOIN athlete_groups ag ON a.userId = ag.athleteId
            JOIN groups g ON ag.groupId = g.id
            WHERE ag.groupId = %s
            AND ag.removed = FALSE
            AND g.deleted = FALSE
        """, (group_id,))

        if(athletes):
            return {
                "statusCode": 200,
                "body": json.dumps(athletes)
            }
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "No athletes found"})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

