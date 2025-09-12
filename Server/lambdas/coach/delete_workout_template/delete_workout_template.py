from rds import execute_commit
import json

#Removes a coaches workout
def delete_workout_template(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        workout_id = query_params['workoutId']
        coach_id = query_params['coachId']

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
            'body': json.dumps({'message': 'Workout deleted successfully'})
        }
    except Exception as e:
        print(f"Error deleting workout: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to delete workout', 'message': str(e)})
        }