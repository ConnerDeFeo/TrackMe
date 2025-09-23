import json
from rds import execute_commit
from user_auth import get_user_info

# Function to invite an athlete to a group
def invite_athlete(event, context):
    body = json.loads(event.get('body', '{}'))
    try:
        user_info = get_user_info(event)
        coach_id = user_info["userId"]
        athlete_id = body['athleteId']

        # Insert the athlete into the group invite table
        execute_commit(
            """
            INSERT INTO athlete_coach_invites (athleteId, coachId)
            VALUES (%s, %s)
            ON CONFLICT (athleteId, coachId) DO NOTHING
            """,
            (athlete_id, coach_id)
        )
        return {
            "statusCode": 200,
            "body": f"Invitation sent to {athlete_id} for coach {coach_id}"
        }
    except Exception as e:
        print(f"Error inviting athlete: {str(e)}")
        return {
            "statusCode": 500,
            "body": f"Error inviting athlete: {str(e)}"
        }
