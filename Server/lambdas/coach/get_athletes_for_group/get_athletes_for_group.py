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
            SELECT a.userId, a.username
            FROM athletes a
            JOIN athlete_groups ag ON a.userId = ag.athleteId
            WHERE ag.groupId = %s
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

