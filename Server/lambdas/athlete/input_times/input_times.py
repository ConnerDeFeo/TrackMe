import json
from rds import execute_commit_many, fetch_one
from datetime import datetime, timezone, timedelta
from user_auth import get_user_info

#Inserts all of an athletes input times for a given group into db
def input_times(event, context):
    body = json.loads(event['body'])

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        inputs = body['inputs'] #inputs in {time: float, distance: int} and {restTime: int}
        athleteIds = body['athleteIds'] # list of athleteIds
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))  # date in 'YYYY-MM-DD' format
        groupId = body['groupId']

        # Check to make sure user is in group
        group = fetch_one("SELECT groupId FROM athlete_groups WHERE groupId=%s AND athleteId=%s", (groupId, user_id))
        if group is None:
            return {
                'statusCode': 403,
                'body': json.dumps({
                    'message': 'User not in group'
                })
            }
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
                    rest_input_params.append((athleteId, groupId, rest_time, date, timestamp))
                else:
                    time = input['time']
                    distance = input['distance']
                    if time == '' or distance == '':
                        continue
                    input_params.append((athleteId, groupId, distance, time, date, timestamp))
    
        #Insert time into rds
        execute_commit_many(
        """
            INSERT INTO athlete_time_inputs (athleteId, groupId, distance, time, date, timeStamp)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, input_params)

        #Insert rest time into rds
        execute_commit_many(
        """
            INSERT INTO athlete_rest_inputs (athleteId, groupId, restTime, date, timeStamp)
            VALUES (%s, %s, %s, %s, %s)
        """, rest_input_params)

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

