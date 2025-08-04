import json
from rds import execute_commit

#Used for inputting time for a group workout
def input_group_time(event, context):
    body = json.loads(event['body'])
    
    try:
        leader_id = body['leaderId']
        workout_group_name = body['workoutGroupName']
        group_name = body['groupName']
        workout_title = body['workoutTitle']
        date = body['date']
        distance = body['distance']
        time = body['time']
        coach_username = body['coachUsername']

        #Insert time for the given athletes
        execute_commit('''
            WITH workout_group AS(
                SELECT wg.id as workout_group_id
                FROM workout_groups wg
                JOIN group_workouts gw ON wg.workoutId = gw.id
                JOIN groups g ON gw.groupId = g.id
                JOIN coaches c ON g.coachId = c.userId
                WHERE wg.leaderId = %s AND wg.workoutGroupName = %s
                AND gw.title = %s AND gw.date = %s
                AND g.name = %s AND c.username = %s
            )
            INSERT INTO workout_group_inputs (workoutGroupId, distance, time)
            VALUES ((SELECT workout_group_id FROM workout_group), %s, %s)
        ''', (leader_id, workout_group_name, workout_title, date, group_name, coach_username, distance, time))

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
