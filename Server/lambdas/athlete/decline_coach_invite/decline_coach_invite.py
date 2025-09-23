from rds import execute_commit
from user_auth import get_user_info

# Declines a coach's request to be the coach of the given athlete
def decline_coach_invite(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        user_info = get_user_info(event)
        athlete_id = user_info["userId"]
        coach_id = query_params['coachId']

        # Delete the request from the athlete_coach_requests table
        execute_commit(
        """
            DELETE FROM athlete_coach_invites
            WHERE athleteId = %s AND coachId = %s
        """, (athlete_id, coach_id))

        return {
            'statusCode': 200,
            'body': 'Coach invite declined successfully.'
        }
    except Exception as e:
        print(f"Error declining coach invite: {e}")
        return {
            'statusCode': 500,
            'body': 'Error declining coach invite: {}'.format(str(e))
        }
