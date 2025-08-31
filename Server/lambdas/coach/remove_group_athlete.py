import json
from rds import execute_commit

def remove_group_athlete(event, context):
    query_params = event.get("queryStringParameters", {})

    try:
        group_id = query_params['groupId']
        athlete_id = query_params['athleteId']

        # Remove the athlete from the group through soft deletion
        execute_commit(
            """
            UPDATE athlete_groups SET removed = TRUE WHERE athleteId = %s AND groupId = %s
            """,
            (athlete_id, group_id)
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
