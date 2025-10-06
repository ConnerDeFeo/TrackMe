import json
from rds import execute_commit
from user_auth import get_user_info, delete_auth_header

def remove_group_athlete(event, context):
    query_params = event.get("queryStringParameters", {})
    auth_header = delete_auth_header()

    try:
        user_info = get_user_info(event)
        coach_id = user_info["userId"]
        group_id = query_params['groupId']
        athlete_id = query_params['athleteId']

        # Remove the athlete from the group through soft deletion
        execute_commit(
            """
                UPDATE athlete_groups ag
                SET removed = %s
                FROM groups g
                WHERE ag.groupId = g.id
                    AND ag.athleteId = %s 
                    AND g.id = %s
                    AND g.coachId = %s
            """,
            (True, athlete_id, group_id, coach_id)
        )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Athlete removed from group successfully"}),
            "headers": auth_header
        }
    except Exception as e:
        print(f"Error removing athlete from group: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Failed to remove athlete from group"}),
            "headers": auth_header
        }
