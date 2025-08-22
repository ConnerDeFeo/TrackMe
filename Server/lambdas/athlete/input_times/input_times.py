import json
from rds import execute_commit_many

#Inserts all of an athletes input times for a given group into db
def input_times(event, context):
    body = json.loads(event['body'])

    try:
        inputs = body['inputs']  # Expecting a list of input dicts
        date = body['date']
        athleteId = body['athleteId']
        groupId = body['groupId']

        params = []
        for input in inputs:
            params.append((athleteId, groupId, input.get('distance',0), input.get('time',0), date))

        #Insert time into rds
        execute_commit_many(
        """
            INSERT INTO athlete_workout_inputs (athleteId, groupId, distance, time, date)
            VALUES (%s, %s, %s, %s, %s)
        """, params)

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

