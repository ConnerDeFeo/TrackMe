import json
from rds import execute_commit_many, execute_commit_fetch_one

#Used for inputting time for a group workout
def input_group_time(event, context):
    body = json.loads(event['body'])
    
    try:
        athlete_id = body['athleteId']
        


        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Workout_group created successfully'
            })
        }

    except Exception as e:
        print(f"Error creating group workout: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error creating group workout: {}'.format(str(e))
            })
        }
