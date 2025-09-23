from rds import fetch_all
import json
from user_auth import get_user_info

#Get all athletes not already part of a given group
def get_absent_group_athletes(event, context):
    query_params = event['queryStringParameters']

    try:
        user_info = get_user_info(event)
        coach_id = user_info["userId"]
        group_id = query_params['groupId']

        # Get absent athletes
        absent_athletes = fetch_all(
        """
            SELECT a.userId, a.username
            FROM athletes a
            JOIN athlete_coaches ac 
                ON a.userId = ac.athleteId
                AND ac.coachId = %s
            LEFT JOIN athlete_groups ag 
                ON a.userId = ag.athleteId
                AND ag.groupId = %s
            WHERE ag.athleteId IS NULL
            OR ag.removed = TRUE
        """, (coach_id, group_id))

        if absent_athletes:
            return {
                "statusCode": 200,
                "body": json.dumps(absent_athletes)
            }
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "No absent athletes found"})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
