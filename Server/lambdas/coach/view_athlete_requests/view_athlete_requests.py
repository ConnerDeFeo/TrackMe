from rds import fetch_all
import json

#Shows all athlete requests for a coach
def view_athlete_requests(event, context):
    body = json.loads(event['body'])

    try:
        user_id = body['userId']

        #Grab all invites for the athlete
        requests = fetch_all(
        """
            SELECT a.username FROM athlete_coach_requests acr
            JOIN athletes a ON acr.athleteId = a.userId
            WHERE acr.coachId = %s
        """, (user_id,))
        return {
            'statusCode': 200,
            'body': json.dumps(requests)
        }

    except Exception as e:
        print(f"Error viewing athlete requests: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error viewing athlete requests: {}'.format(str(e))
            })
        }