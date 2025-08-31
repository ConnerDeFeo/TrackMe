import json
from rds import execute_commit

def remove_coach_athlete(event, context):
    query_params = event.get("queryStringParameters", {})
    try:
        coach_id = query_params['coachId']
        athlete_id = query_params['athleteId']

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