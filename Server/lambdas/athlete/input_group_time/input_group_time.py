import json
from rds import execute_commit_many, execute_commit_fetch_one

#Used for inputting time for a group workout
def input_group_time(event, context):
    body = json.loads(event['body'])
    
    try:
        athlete_id = body['athleteId']
        other_athletes = body['other athletes']
        workout_title = body['workoutTitle']
        coach_username = body['coachUsername']
        date = body['date']
        group_name = body['groupName']
        time = body['time']
        distance = body['distance']

        #Create a group for the workout
        execute_commit_fetch_one("""
            WITH workout_info AS (
                SELECT gw.id as workout_id
                FROM group_workouts gw
                JOIN groups g ON gw.groupId = g.id
                JOIN coaches c ON g.coachId = c.userId
                WHERE gw.title = %s 
                AND gw.date = %s 
                AND g.name = %s 
                AND c.username = %s
            )
            INSERT INTO workout_groups (leaderId, workoutId, date)
            VALUES (%s, (SELECT workout_id FROM workout_info), %s)
            RETURNING id
        """, (workout_title, date, group_name, coach_username, athlete_id, date))

    except Exception as e:
        print(f"Error creating group workout: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error creating group workout: {}'.format(str(e))
            })
        }
