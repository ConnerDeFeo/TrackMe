import json
from rds import fetch_all

#Fetches all of a given coaches workouts
def get_workouts(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        coach_id = query_params['coachId']

        #Grab all workouts accosiated with the coach_id
        workouts = fetch_all(
            """
                SELECT * FROM workouts
                WHERE coachId = %s AND deleted = %s
            """,
            (coach_id, False)
        )
        if workouts:
            return {
                "statusCode": 200,
                "body": json.dumps(workouts)
            }
        return {
            "statusCode": 404,
            "body": "No workouts found"
        }

    except Exception as e:
        print(f"Error parsing input: {e}")
        return {
            "statusCode": 500,
            "body": f"Error fetching workouts: {str(e)}"
        }
