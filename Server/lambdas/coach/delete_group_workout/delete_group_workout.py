from rds import execute_commit
from user_auth import get_user_info

def delete_group_workout(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        user_info = get_user_info(event)
        coach_id = user_info['userId']
        group_workout_id = query_params['groupWorkoutId']

        #Delete the workout with the given workout_id
        #(Soft delete by setting deleted to True)
        execute_commit(
            """
                DELETE gw FROM group_workouts gw
                JOIN groups g ON gw.groupId = g.id
                WHERE gw.id = %s AND g.coachId = %s
            """,
            (group_workout_id, coach_id)
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