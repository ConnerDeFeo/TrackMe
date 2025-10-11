import json
from rds import fetch_one
from user_auth import get_auth_header, get_user_info

def get_workout(event, context):
    query_params = event.get('queryStringParameters', {})
    auth_header = get_auth_header()

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        workoutId = query_params['workoutId']

        # Fetch workout from DB
        workout = fetch_one("SELECT title, description, sections FROM workouts WHERE id = %s AND coachId = %s AND isTemplate = TRUE", (workoutId, user_id))
        if not workout:
            return {
                'statusCode': 409,
                'body': json.dumps({'error': 'Not Authorized to view this workout or workout does not exist'})
            }

        return {
            'statusCode': 200,
            'body': json.dumps({'title': workout[0], 'description': workout[1], 'sections': workout[2], 'workoutId': workoutId}),
            'headers': auth_header
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request parameters'}),
            'headers': auth_header
        }