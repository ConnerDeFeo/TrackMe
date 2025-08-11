import json
from rds import execute_commit_fetch_one
from dynamo import update_item

#Used for inputting time for a group workout
def input_group_time(event, context):
    body = json.loads(event['body'])
    
    try:
        leader_id = body['leaderId']
        workout_group_name = body['workoutGroupName']
        group_name = body['groupName']
        workout_id = body['workoutId']
        date = body['date']
        distance = body['distance']
        time = body['time']
        coach_username = body['coachUsername']

        #Insert time for the given athletes
        coach_id = execute_commit_fetch_one(
        '''
            WITH workout_group AS(
                SELECT wg.id as wgid, c.userid as coach_id
                FROM workout_groups wg
                JOIN group_workouts gw ON wg.workoutId = gw.id
                JOIN groups g ON gw.groupId = g.id
                JOIN coaches c ON g.coachId = c.userId
                WHERE wg.leaderId = %s AND wg.workoutGroupName = %s
                AND gw.workoutId = %s AND gw.date = %s
                AND g.name = %s AND c.username = %s
            )
            INSERT INTO workout_group_inputs (workoutGroupId, distance, time)
            SELECT workout_group.wgid, %s, %s
            FROM workout_group
            RETURNING (SELECT coach_id FROM workout_group)
        ''', (leader_id, workout_group_name, workout_id, date, group_name, coach_username, distance, time))

        if not coach_id:
            raise ValueError("Workout group not found or invalid parameters provided.")
        
        #Insert into dynamo
        group_date_identifier = f"{coach_id[0]}#{group_name}#{date}"
        input_type = f"group#{workout_group_name}"
        update_item(
            'WorkoutInputs',
            key={'group_date_identifier': group_date_identifier, 'input_type': input_type},
            update_expression="""
                SET inputs = list_append(if_not_exists(inputs, :empty_list), :new_entry),
                    leader_id = :leader_id
            """,
            expression_attribute_values={
                ':new_entry': [{'time': time, 'distance': distance}],
                ':empty_list': [],
                ':leader_id': leader_id
            }
        )


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
