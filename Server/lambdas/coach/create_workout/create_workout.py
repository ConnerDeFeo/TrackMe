from dynamo import put_item
import json

def create_workout(event, context):
    body = json.loads(event['body'])
    try:
        title = body['title']
        coach_id = body['coach_id']

        # Put item into DynamoDB
        put_item('Workouts', {
            'coach_id': coach_id,
            'title': title,
            'description': body.get('description', ''),
            'excersies': body.get('excersies', [])
        })
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Workout created successfully'})
        }

    except Exception as e:
        print(f"Error parsing input: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Invalid input', 'message': str(e)})
        }