import json
from rds import execute_commit
from user_auth import get_user_info

def remove_group_athlete(event, context):
    query_params = event.get("queryStringParameters", {})

    try:
        user_info = get_user_info(event)
        coach_id = user_info['userId']
        group_id = query_params['groupId']
        athlete_id = query_params['athleteId']

        # Remove the athlete from the group through soft deletion
        execute_commit(
            """
                UPDATE athlete_groups ag
                JOIN groups g ON ag.groupId = g.id
                SET ag.removed = TRUE
                WHERE ag.athleteId = %s 
                AND g.id = %s
                AND g.coachId = %s
            """,
            (athlete_id, group_id, coach_id)
        )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Athlete removed from group successfully"})
        }
    except Exception as e:
        print(f"Error removing athlete from group: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Failed to remove athlete from group"})
        }
