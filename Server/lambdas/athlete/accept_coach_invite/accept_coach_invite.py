import json
from rds import execute_commit
from user_auth import get_user_info

# Function to accept a coach invite
def accept_coach_invite(event, context):
    # Extract athleteId and coachId from the event
    body = json.loads(event['body'])
    try:
        user_info = get_user_info(event)
        coach_id = user_info['user_id']
        athlete_id = body['athleteId']

        # Insert the athlete into the group, remove the invite
        execute_commit(
            """
            INSERT INTO athlete_coaches (athleteId, coachId)
            VALUES (%s, %s); DELETE FROM athlete_coach_invites WHERE athleteId = %s AND coachId = %s;
            """,
            (athlete_id, coach_id, athlete_id, coach_id)
        )
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Coach invite accepted successfully'})
        }
    except Exception as e:
        print(f"Error accepting coach invite: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
