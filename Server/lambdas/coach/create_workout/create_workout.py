from dynamo import put_item
import json
import uuid

def create_workout(event, context):
    body = json.loads(event['body'])
    try:
        coach_id = body['coachId']
        title = body['title']
        workout_id = body.get('workoutId', str(uuid.uuid4()))  # Generate a unique ID for the workout

        # Put item into DynamoDB
        put_item('Workouts', {
            'coach_id': coach_id,
            'workout_id': workout_id,
            'title': title,
            'description': body.get('description', ''),
            'exersies': body.get('exersies', [])
        })
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Workout created successfully', 'workout_id': workout_id})
        }

    except Exception as e:
        print(f"Error parsing input: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Invalid input', 'message': str(e)})
        }
    
    