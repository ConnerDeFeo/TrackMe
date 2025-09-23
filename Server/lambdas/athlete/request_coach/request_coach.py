import json
from rds import execute_commit
from user_auth import get_user_info

# Function to request a certain coach adds this athlete to their roster
def request_coach(event, context):
    body = json.loads(event.get('body', '{}'))
    try:
        user_info = get_user_info(event)
        athlete_id = user_info['userId']
        coach_id = body['coachId']

        # Insert the athlete into the group invite table
        execute_commit(
            """
                INSERT INTO athlete_coach_requests (athleteId, coachId)
                VALUES (%s, %s)
                ON CONFLICT (athleteId, coachId) DO NOTHING
            """,
            (athlete_id, coach_id)
        )
        return {
            "statusCode": 200,
            "body": f"Request sent to {coach_id} for athlete {athlete_id}"
        }
    except Exception as e:
        print(f"Error requesting coach: {str(e)}")
        return {
            "statusCode": 500,
            "body": f"Error requesting coach: {str(e)}"
        }
