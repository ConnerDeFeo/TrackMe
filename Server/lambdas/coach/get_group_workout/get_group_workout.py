from rds import fetch_all
import json

#Gets all workouts for a given group for a given date
def get_group_workout(event,context):
    query_params = event.get('queryStringParameters', {})

    try:
        coach_id = query_params['coachId']
        group_id = query_params['groupId']
        date = query_params['date']

        #Get the workout title for the given date
        workouts = fetch_all(
            """
                SELECT w.id, w.title, w.description, w.exercises FROM group_workouts gw
                JOIN workouts w ON gw.workoutId = w.id
                WHERE gw.groupId = %s AND gw.date = %s
            """,
            (group_id, date)
        )
        if workouts:
            
            return {
                'statusCode': 200,
                'body': json.dumps(workouts)
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