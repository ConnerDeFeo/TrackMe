import json
from rds import execute_commit_many, fetch_one
from datetime import datetime, timezone
from user_auth import get_user_info

#Inserts all of an athletes input times for a given group into db
def input_times(event, context):
    body = json.loads(event['body'])

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        inputs = body['inputs'] #inputs in {time: float, distance: int}
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

