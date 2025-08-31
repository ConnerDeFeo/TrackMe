import json
from rds import execute_commit

def remove_coach_athlete(event, context):
    body = json.loads(event.get("body", "{}"))
    try:
        coach_id = body['coachId']
        athlete_id = body['athleteId']

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