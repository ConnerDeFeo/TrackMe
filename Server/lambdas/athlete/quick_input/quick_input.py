import json
from rds import execute_commit_fetch_one
from datetime import datetime, timezone, timedelta
from user_auth import post_auth_header, get_user_info

def quick_input(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        input = body['input'] #input in {time: float, distance: int} or {restTime: int}
        athlete_id = body['athleteId'] # athleteId to input for
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))  # date in 'YYYY-MM-DD' format

        # Insert input into rds only if use is allowed to input for the athlete
        if input['type'] == 'rest':
            rest_time = input['restTime']
            # Insert rest time
            sucess = execute_commit_fetch_one(
                """
                    INSERT INTO athlete_rest_inputs (athleteId, restTime, date)
                    SELECT %s, %s, %s
                    WHERE  %s = %s
                    OR EXISTS (
                        SELECT 1
                        FROM user_relations ur1
                        JOIN user_relations ur2
                            ON ur1.userId = ur2.relationId
                            AND ur1.relationId = ur2.userId
                        WHERE ur1.userId = %s
                        AND ur1.relationId = %s
                    )
                    RETURNING id
                """, (athlete_id, rest_time, date, user_id, athlete_id, user_id, athlete_id)
            )
        else:
            distance = input['distance']
            time = input['time']

            sucess = execute_commit_fetch_one(
                """
                    INSERT INTO athlete_time_inputs (athleteId, distance, time, date)
                    SELECT %s, %s, %s, %s
                    WHERE  %s = %s
                    OR EXISTS (
                        SELECT 1
                        FROM user_relations ur1
                        JOIN user_relations ur2
                            ON ur1.userId = ur2.relationId
                            AND ur1.relationId = ur2.userId
                        WHERE ur1.userId = %s
                        AND ur1.relationId = %s
                    )
                    RETURNING id
                """, (athlete_id, distance, time, date, user_id, athlete_id, user_id, athlete_id)
            )
        if sucess:
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Input recorded successfully'
                }),
                'headers':auth_header
            }
        return {
            'statusCode': 403,
            'body': json.dumps({
                'message': 'User not authorized to input for this athlete'
            }),
            'headers':auth_header
        }

    except Exception as e:
        print(f"Error parsing input: {str(e)}")
        return {
            'statusCode': 400,
            'body': json.dumps({
                'message': 'Invalid input format: {}'.format(str(e))
            }),
            'headers':auth_header
        }