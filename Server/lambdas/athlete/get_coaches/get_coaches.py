from rds import fetch_all
import json
from user_auth import get_user_info

# Gets all of an athlete's current coaches
def get_coaches(event, context):

    try:
        user_info = get_user_info(event)
        user_id = user_info["userId"]

        # Get all coaches
        coaches = fetch_all(
            """
                SELECT c.userId, c.username, c.firstName, c.lastName
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

