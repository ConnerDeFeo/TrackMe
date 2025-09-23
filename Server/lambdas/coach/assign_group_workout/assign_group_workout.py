import json 
from rds import execute_commit, execute_commit_fetch_one
from user_auth import get_user_info

def assign_group_workout(event, context):
    body = json.loads(event['body'])

    try:
        user_info = get_user_info(event)
        coach_id = user_info['user_id']
        group_id = body['groupId']
        title = body['title']
        description = body.get('description', '')
        exercises = body.get('exercises', [])
        workout_id = body.get('workoutId')
        
        if workout_id:
            # If workoutId is provided, update the existing workout
            execute_commit(
                """
                    UPDATE workouts
                    SET title = %s, description = %s, exercises = %s
                    WHERE id = %s AND coachId = %s
                """,
                (title, description, json.dumps(exercises), workout_id, coach_id)
            )
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Workout updated successfully', 'workout_id': workout_id})
            }

        # Create a new workout and fetch the id
        workout_id = execute_commit_fetch_one(
            """
                INSERT INTO workouts (coachId, title, description, exercises, isTemplate)
                VALUES (%s, %s, %s, %s, FALSE)
                RETURNING id
            """,
            (coach_id, title, description, json.dumps(exercises))
        )
        if workout_id:
            # Assign the workout to the group
            execute_commit(
                """
                    INSERT INTO group_workouts (groupId, workoutId)
                    VALUES (%s, %s)
                """,
                (group_id, workout_id[0])
            )
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Workout assigned to group successfully', 'workout_id': workout_id[0]})
            }
        return {
            'statusCode': 409,
            'body': json.dumps({'error': 'Conflict creating or assigning workout'})
        }
    except Exception as e:
        print(f"Error assigning workout to group: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }