import json
from rds import execute_commit_many
from datetime import datetime, timezone
#Inserts all of an athletes input times for a given group into db
def input_times(event, context):
    body = json.loads(event['body'])

    try:
        inputs = body['inputs'] #inputs in {time: float, distance: int}
        athleteIds = body['athleteIds'] # list of athleteIds
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))  # date in 'YYYY-MM-DD' format
        groupId = body['groupId']

        #Create all inputs
        params = []
        for athleteId in athleteIds:
            for input in inputs:
                time = input['time']
                distance = input['distance']
                if time == '' or distance == '':
                    continue
                params.append((athleteId, groupId, distance, time, date))

        #Insert time into rds
        execute_commit_many(
        """
            INSERT INTO athlete_inputs (athleteId, groupId, distance, time, date)
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

