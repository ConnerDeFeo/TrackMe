import json
from rds import execute_commit

#Inserts an athlets workout time into the database for a given date and group
def input_time(event, context):
    body = json.loads(event['body'])

    try:
        athlete_id = body['athleteId']
        workout_title = body['workoutTitle']
        coach_username = body['coachUsername']
        group_name = body['groupName']
        date = body['date']
        time = body['time']
        distance = body['distance']

        # Insert workout time into database
        # To do this we need the group id, which we get by getting the group name and getting
        # the coach username thorugh the passed in username
        execute_commit("""
            INSERT INTO athlete_workout_inputs 
                (athleteId, groupWorkoutId, date, time, distance)
            VALUES (
                %s,
                (
                    SELECT id FROM group_workouts 
                    WHERE title = %s AND date = %s AND groupId = (
                        SELECT id FROM groups 
                        WHERE name = %s AND coachId = (
                            SELECT userId FROM coaches WHERE username = %s
                        )
                    )
                ),
                %s, %s, %s
            )
        """, (athlete_id, workout_title, date, group_name, coach_username, date, time, distance))
        print((athlete_id, workout_title, date, group_name, coach_username, date, time, distance))

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Time input recorded successfully'
            })
        }
    except Exception as e:
        print(f"Error recording time input: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error recording time input: {}'.format(str(e))
            })
        }

