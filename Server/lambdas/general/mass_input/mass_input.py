import json
from rds import execute_commit_many, fetch_one
from datetime import datetime, timezone
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
                INSERT INTO athlete_time_inputs (athleteId, groupId, distance, time, date)
                VALUES (%s, %s, %s, %s, %s)
            """, params)
        
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