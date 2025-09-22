import json
from rds import execute_commit_many
from datetime import datetime, timezone

# Insert multiple athlete inputs into the database
def mass_input(event, context):
    body = json.loads(event['body'])

    try:
        athlete_data = body['athleteData'] # map {athleteId: [{time: float, distance: int}]}
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))  # date in 'YYYY-MM-DD' format, optional
        groupId = body['groupId']

        # Prepare parameters for bulk insert
        params = []
        for athleteId, inputs in athlete_data.items():
            for input in inputs:
                time = input['time']
                distance = input['distance']
                if time == '' or distance == '':
                    continue
                params.append((athleteId, groupId, distance, time, date))

        # Bulk insert into the database
        execute_commit_many(
            """
            INSERT INTO athlete_inputs (athleteId, groupId, distance, time, date)
            VALUES (%s, %s, %s, %s, %s)
            """, params)
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Mass input successful'
            })
        }
    except Exception as e:
        print(f"Error in mass input: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error in mass input: {}'.format(str(e))
            })
        }