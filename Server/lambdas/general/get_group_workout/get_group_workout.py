from datetime import datetime, timezone
from rds import fetch_all
import json

#Gets all workouts for a given group for a given date
def get_group_workout(event,context):
    query_params = event.get('queryStringParameters', {})

    try:
        group_id = query_params['groupId']
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        #Get the workout title for the given date
        workouts = fetch_all(
            """
                SELECT id, title, description, exercises
                FROM group_workouts
                WHERE groupId = %s AND date = %s
            """,
            (group_id, date)
        )
        if workouts:
            converted_workouts = []
            for workout in workouts:
                converted_workouts.append({
                    'id': workout[0],
                    'title': workout[1],
                    'description': workout[2],
                    'exercises': workout[3]
                })
            return {
                'statusCode': 200,
                'body': json.dumps(converted_workouts)
            }
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'No workouts found'})
        }

    except Exception as e:
        print(f"Error fetching workout: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }