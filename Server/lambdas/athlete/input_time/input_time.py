import json
from rds import execute_commit

#Inserts an athlets workout time into the database for a given date and group
def input_time(event, context):
    body = json.loads(event['body'])

    try:
        athlete_id = body['athleteId']
        group_id = body['groupId']
        date = body['date']
        time = body['time']
        distance = body['distance']
    
        #Insert time into rds
        execute_commit(
        """
            INSERT INTO athlete_workout_inputs (athleteId, groupId, time, distance, date)
            VALUES (%s, %s, %s, %s, %s)
        """, (athlete_id, group_id, time, distance, date))

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

