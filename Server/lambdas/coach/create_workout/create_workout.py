from rds import execute_commit_fetch_one
import json
import uuid

def create_workout(event, context):
    body = json.loads(event['body'])
    try:
        coach_id = body['coachId']
        title = body['title']

        workout_id = execute_commit_fetch_one(
            """
                INSERT INTO workouts (coachId, title, description, exercises)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            """,
            (coach_id, title, body.get('description', ''), json.dumps(body.get('exercises', [])))
        )
        if not workout_id or not workout_id[0]:
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
    
    