import json
from rds import fetch_all

#Gets all of a coaches athletes
def get_athletes(event, context):
    query_params = event.get('queryStringParameters', {})
    try:
        coach_id = query_params.get('coachId')

        #Fetch athletes from the database
        athletes = fetch_all("""
            SELECT a.userId, a.username
            FROM athletes a
            JOIN athlete_coaches ac ON a.userId = ac.athleteId
            JOIN coaches c ON ac.coachId = c.userId
            WHERE c.userId = %s;
        """, (coach_id,))
        if athletes:
            return {
                'statusCode': 200,
                'body': json.dumps(athletes)
            }
        return {
            'statusCode': 404,
            'body': json.dumps({'message': 'No athletes found'})
        }
    except Exception as e:
        print(f"Error getting athletes: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
