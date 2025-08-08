import json
from rds import fetch_all

#For a given group, gets all althetes and a flag indivcating weather they have been added or not
def get_athletes_for_group(event, context):
    query_params = event['queryStringParameters']
    
    try:
        group_id = query_params.get('groupId')
        
        #Get athletes
        athletes = fetch_all(
        """
            SELECT a.userId, a.username,
                CASE 
                    WHEN ag.athleteId IS NOT NULL THEN TRUE
                    ELSE FALSE
                END AS added
            FROM athletes a
            LEFT JOIN athlete_groups ag ON a.userId = ag.athleteId
            AND ag.groupId = %s
        """, (group_id,))

        return {
            "statusCode": 200,
            "body": json.dumps(athletes)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

