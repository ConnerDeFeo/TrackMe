import json
from rds import execute_commit

#Used for inputting time for a group workout
def input_group_time(event, context):
    body = json.loads(event['body'])
    
    try:
        workout_group_id = body['workoutGroupId']
        distance = body['distance']
        time = body['time']

        #Insert time for the given athletes
        execute_commit(
        '''
            INSERT INTO workout_group_inputs (workoutGroupId, distance, time)
            VALUES (%s, %s, %s)
        ''', (workout_group_id, distance, time))

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
