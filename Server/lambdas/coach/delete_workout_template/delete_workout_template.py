from rds import execute_commit
import json
from user_auth import get_user_info, delete_auth_header

#Removes a coaches workout
def delete_workout_template(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        user_info = get_user_info(event)
        coach_id = user_info['userId']
        workout_id = query_params['workoutId']

        #Update the table to soft delete the workout
        execute_commit(
            """
                UPDATE workouts
                SET isTemplate = FALSE
                WHERE id = %s AND coachId = %s
            """,
            (workout_id, coach_id)
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Workout deleted successfully'}),
            'headers': delete_auth_header()
        }
    except Exception as e:
        print(f"Error deleting workout: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to delete workout', 'message': str(e)}),
            'headers': delete_auth_header()
        }
    