from rds import execute_commit_fetch_one, execute_commit
import json
from user_auth import get_user_info

def create_workout_template(event, context):
    body = json.loads(event['body'])
    try:
        user_info = get_user_info(event)
        coach_id = user_info["userId"]
        workout_id = body.get('workoutId', '')
        title = body['title']
        description = body.get('description', '')
        exercises = body.get('exercises', [])

        # If given workout id, edit current workout
        if workout_id:
            # Update existing workout
            execute_commit(
                """
                    UPDATE workouts
                    SET isTemplate = FALSE
                    WHERE id = %s
                """,
                (workout_id,)
            )
        # Create a new workout regardless
        workout_id = execute_commit_fetch_one(
            """
                INSERT INTO workouts (coachId, title, description, exercises, isTemplate)
                VALUES (%s, %s, %s, %s, TRUE)
                RETURNING id
            """,
            (coach_id, title, description, json.dumps(exercises))
        )
        if not workout_id:
            return {
                'statusCode': 409,
                'body': json.dumps({'error': 'Conflict creating workout'})
            }
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Workout created successfully', 'workout_id': workout_id[0]})
        }

    except Exception as e:
        print(f"Error parsing input: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Invalid input', 'message': str(e)})
        }
    
    