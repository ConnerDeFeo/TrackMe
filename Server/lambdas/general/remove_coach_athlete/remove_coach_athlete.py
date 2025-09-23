import json
from rds import execute_commit
from user_auth import get_user_info

def remove_coach_athlete(event, context):
    query_params = event.get("queryStringParameters", {})
    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        coach_id = query_params['coachId']
        athlete_id = query_params['athleteId']

        # Ensure the user making the request is either the coach or athlete involved
        if user_id != coach_id and user_id != athlete_id:
            return {
                "statusCode": 403,
                "body": json.dumps({"error": "User not authorized to remove this relationship"})
            }

        # Remove relation from db
        execute_commit("""
            DELETE FROM athlete_coaches WHERE coachId = %s AND athleteId = %s
        """, (coach_id, athlete_id))

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Coach removed from athlete successfully"})
        }
    except Exception as e:
        print("Error removing coach athlete relationship:", e)
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }