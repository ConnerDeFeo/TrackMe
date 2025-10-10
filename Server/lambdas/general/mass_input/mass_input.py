import json
from rds import execute_commit_many, fetch_one
from datetime import datetime, timezone, timedelta
from user_auth import get_user_info, post_auth_header

# Insert multiple athlete inputs into the database
def mass_input(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        groupId = body['groupId']

        # Check to see if user is a coach or athlete that is actually part of group
        exists = fetch_one(
        """
            SELECT id FROM groups g
            JOIN athlete_groups ag ON g.id = ag.groupId
            WHERE g.id = %s AND (g.coachId = %s OR ag.athleteId = %s)
        """, (groupId, user_id, user_id))
        if not exists:
            return {
                'statusCode': 403,
                'body': json.dumps({
                    'message': 'User not authorized for this group'
                }),
                'headers': auth_header
            }

        athlete_data = body['athleteData'] # map {athleteId: [{time: float, distance: int}]}
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))  # date in 'YYYY-MM-DD' format, optional

        # Prepare parameters for bulk insert
        rest_params = []
        time_params = []
        now = datetime.now(timezone.utc)
        for athleteId, inputs in athlete_data.items():
            for j, input in enumerate(inputs):
                timestamp = now + timedelta(milliseconds=j)
                if input['type'] == 'rest':
                    rest_time = input['restTime']
                    if rest_time == '':
                        continue
                    rest_params.append((athleteId, groupId, rest_time, date, timestamp))
                else:
                    time = input['time']
                    distance = input['distance']
                    if time == '' or distance == '':
                        continue
                    time_params.append((athleteId, groupId, distance, time, date, timestamp))

        # Bulk insert into the database for time inputs
        execute_commit_many(
            """
                INSERT INTO athlete_time_inputs (athleteId, groupId, distance, time, date, timeStamp)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, time_params)
        
        # Bulk insert into the database for rest inputs
        execute_commit_many(
            """
                INSERT INTO athlete_rest_inputs (athleteId, groupId, restTime, date, timeStamp)
                VALUES (%s, %s, %s, %s, %s)
            """, rest_params)
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Mass input successful'
            }),
            'headers': auth_header
        }
    except Exception as e:
        print(f"Error in mass input: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error in mass input: {}'.format(str(e))
            }),
            'headers': auth_header
        }