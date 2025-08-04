import json
from rds import execute_commit_fetch_one
from dynamo import update_item

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
        coach_id = execute_commit_fetch_one(
        """
            WITH workout_info AS (
                SELECT gw.id AS workout_id, c.userId AS coach_id
                FROM group_workouts gw
                JOIN groups g ON gw.groupId = g.id
                JOIN coaches c ON g.coachId = c.userId
                WHERE gw.title = %s 
                AND gw.date = %s 
                AND g.name = %s 
                AND c.username = %s
            )
            INSERT INTO athlete_workout_inputs (athleteId, groupWorkoutId, time, distance)
            SELECT %s, wi.workout_id, %s, %s
            FROM workout_info wi
            RETURNING (SELECT coach_id FROM workout_info)
        """, (workout_title, date, group_name, coach_username, athlete_id, time, distance))

        if not coach_id:
            raise ValueError("Invalid workout or group information provided.")
        
        #Insert into dynamo
        group_date_identifier = f"{coach_id[0]}#{group_name}#{date}"
        input_type = f"individual#{athlete_id}"
        update_item(
            'WorkoutInputs',
            key={'group_date_identifier': group_date_identifier, 'input_type': input_type},
            update_expression="SET inputs = list_append(if_not_exists(inputs, :empty_list), :new_entry)",
            expression_attribute_values={
                ':new_entry': [{'time': time, 'distance': distance}],
                ':empty_list': []
            }
        )

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

