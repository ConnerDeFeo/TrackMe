import json
from rds import execute_commit_many
from datetime import datetime, timezone, timedelta
from user_auth import post_auth_header

#Inserts all of an athletes input times for a given group into db
def input_times(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:
        inputs = body['inputs'] #inputs in {time: float, distance: int} and {restTime: int}
        athleteIds = body['athleteIds'] # list of athleteIds
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))  # date in 'YYYY-MM-DD' format
        now = datetime.now(timezone.utc)

        #Create all inputs
        input_params = []
        rest_input_params = []
        for  athleteId in athleteIds:
            for j, input in enumerate(inputs):
                timestamp = now + timedelta(milliseconds=j)
                if input['type'] == 'rest':
                    rest_time = input['restTime']
                    if rest_time == '':
                        continue
                    rest_input_params.append((athleteId, rest_time, date, timestamp))
                else:
                    time = input['time']
                    distance = input['distance']
                    if time == '' or distance == '':
                        continue
                    input_params.append((athleteId, distance, time, date, timestamp))
    
        #Insert time into rds
        execute_commit_many(
        """
            INSERT INTO athlete_time_inputs (athleteId, distance, time, date, timeStamp)
            VALUES (%s, %s, %s, %s, %s)
        """, input_params)

        #Insert rest time into rds
        execute_commit_many(
        """
            INSERT INTO athlete_rest_inputs (athleteId, restTime, date, timeStamp)
            VALUES (%s, %s, %s, %s)
        """, rest_input_params)

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Time input recorded successfully'
            }),
            'headers':auth_header
        }
    except Exception as e:
        print(f"Error recording time input: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error recording time input: {}'.format(str(e))
            }),
            'headers':auth_header
        }

