from rds import execute_commit
from user_auth import get_user_info

# Declines an athlete's request to be coached by the current coach
def decline_athlete_request(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        user_info = get_user_info(event)
        coach_id = user_info['user_id']
        athlete_id = query_params['athleteId']

        # Delete the request from the athlete_coach_requests table
        execute_commit(
        """
            DELETE FROM athlete_coach_requests
            WHERE athleteId = %s AND coachId = %s
        """, (athlete_id, coach_id))

        return {
            'statusCode': 200,
            'body': 'Athlete request declined successfully.'
        }
    except Exception as e:
        print(f"Error declining athlete request: {e}")
        return {
            'statusCode': 500,
            'body': 'Error declining athlete request: {}'.format(str(e))
        }
