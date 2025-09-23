from rds import fetch_all
import json
from user_auth import get_user_info

#Shows all athlete requests for a coach
def view_athlete_requests(event, context):
    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        
        #Grab all invites for the coach
        requests = fetch_all(
        """
            SELECT a.userId, a.username
            FROM athletes a
            JOIN athlete_coach_requests acr ON acr.athleteId = a.userId
            WHERE acr.coachId = %s
        """, (user_id,))
        if requests:
            return {
                'statusCode': 200,
                'body': json.dumps(requests)
            }
        return {
            'statusCode': 404,
            'body': json.dumps({
                'message': 'No pending requests found'
            })
        } 

    except Exception as e:
        print(f"Error viewing athlete requests: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error viewing athlete requests: {}'.format(str(e))
            })
        }