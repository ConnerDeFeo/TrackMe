from dynamo import get_item
from decimal_encoder import DecimalEncoder
from rds import fetch_one
import json

#Gets a workout for a given group for a given date
def get_group_workout(event,context):
    query_params = event.get('queryStringParameters', {})

    try:
        coach_id = query_params['coachId']
        group_id = query_params['groupId']
        date = query_params['date']

        #Get the workout title for the given date
        workout_title = fetch_one(
            """
            SELECT title FROM group_workouts
            WHERE groupId = %s AND date = %s
            """,
            (group_id, date)
        )
        if not workout_title:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Workout not found'})
            }
        
        #Fetch workout from dynamo
        workout = get_item('Workouts', {'title': workout_title[0], 'coach_id': coach_id})
        return {
            'statusCode': 200,
            'body': json.dumps(workout, cls=DecimalEncoder)
        }

    except Exception as e:
        print(f"Error fetching workout: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }