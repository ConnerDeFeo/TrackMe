from rds import execute_commit

def delete_group_workout(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        group_workout_id = query_params['groupWorkoutId']

        #Delete the workout with the given workout_id
        #(Soft delete by setting deleted to True)
        execute_commit(
            """
                DELETE FROM group_workouts 
                WHERE id = %s
            """,
            (group_workout_id,)
        )
        
        return {
            "statusCode": 200,
            "body": "Workout deleted successfully"
        }

    except Exception as e:
        print(f"Error parsing input: {e}")
        return {
            "statusCode": 500,
            "body": f"Error deleting workout: {str(e)}"
        }