from rds import fetch_all
import json

# Gets all of an athlete's current coaches
def get_coaches(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        user_id = query_params['userId']

        # Get all coaches
        coaches = fetch_all(
            """
                SELECT c.username 
                FROM coaches c
                JOIN athlete_coaches ac ON c.userId = ac.coachId
                WHERE ac.athleteId = %s
            """,
            (user_id,)
        )

        if coaches:
            return {
                'statusCode': 200,
                'body': json.dumps(coaches)
            }
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'No coaches found'})
        }

    except Exception as e:
        print(f"Error fetching coaches: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

