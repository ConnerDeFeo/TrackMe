import json
from rds import execute_commit

# Function to accept a athlete request
def accept_athlete_request(event, context):
    # Extract athleteId and coachId from the event
    body = json.loads(event['body'])
    try:
        athlete_id = body['athleteId']
        coach_id = body['coachId']

        # Insert the athlete into the group, remove the invite
        execute_commit(
            """
            INSERT INTO athlete_coaches (athleteId, coachId)
            VALUES (%s, %s); DELETE FROM athlete_coach_requests WHERE athleteId = %s AND coachId = %s;
            """,
            (athlete_id, coach_id, athlete_id, coach_id)
        )
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Athlete request accepted successfully'})
        }
    except Exception as e:
        print(f"Error accepting athlete request: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
