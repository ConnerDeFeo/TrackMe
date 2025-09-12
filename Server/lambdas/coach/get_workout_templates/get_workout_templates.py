import json
from rds import fetch_all

#Fetches all of a given coaches workouts
def get_workout_templates(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        coach_id = query_params['coachId']

        #Grab all workouts accosiated with the coach_id
        workouts = fetch_all(
            """
                SELECT id, title, description, exercises 
                FROM workouts 
                WHERE coachId = %s AND isTemplate = %s
            """,
            (coach_id,True)
        )
        
        if workouts:
            converted_workouts = []
            for workout in workouts:
                converted_workout = {
                    'workoutId': workout[0],
                    'title': workout[1],
                    'description': workout[2],
                    'exercises': workout[3]
                }
                converted_workouts.append(converted_workout)
            return {
                "statusCode": 200,
                "body": json.dumps(converted_workouts)
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
