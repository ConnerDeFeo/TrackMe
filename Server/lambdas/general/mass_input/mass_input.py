import json
from rds import execute_commit_many
from datetime import datetime, timezone, timedelta
from user_auth import post_auth_header

# Insert multiple athlete inputs into the database
def mass_input(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:

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
                    rest_params.append((athleteId, rest_time, date, timestamp))
                else:
                    time = input['time']
                    distance = input['distance']
                    if time == '' or distance == '':
                        continue
                    time_params.append((athleteId, distance, time, date, timestamp))

        # Bulk insert into the database for time inputs
        execute_commit_many(
            """
                INSERT INTO athlete_time_inputs (athleteId, distance, time, date, timeStamp)
                VALUES (%s, %s, %s, %s, %s)
            """, time_params)
        
        # Bulk insert into the database for rest inputs
        execute_commit_many(
            """
                INSERT INTO athlete_rest_inputs (athleteId, restTime, date, timeStamp)
                VALUES (%s, %s, %s, %s)
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