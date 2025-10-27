import json
from rds import execute_commit_fetch_all
from datetime import datetime, timezone, timedelta
from user_auth import post_auth_header, get_user_info

#Inserts all of an athletes input times for a given group into db
def input_times(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        inputs = body['inputs'] #inputs in {time: float, distance: int} and {restTime: int}
        athleteIds = body['athleteIds'] # list of athleteIds
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))  # date in 'YYYY-MM-DD' format
        now = datetime.now(timezone.utc)

        #Create all inputs
        input_params = []
        rest_input_params = []
        note_input_params = []
        for  athleteId in athleteIds:
            for j, input in enumerate(inputs):
                timestamp = now + timedelta(milliseconds=j)
                if input['type'] == 'rest':
                    rest_time = input['restTime']
                    if rest_time == '':
                        continue
                    rest_input_params.append((athleteId, rest_time, date, timestamp))
                elif input['type'] == 'run':
                    time = input['time']
                    distance = input['distance']
                    if time == '' or distance == '':
                        continue
                    input_params.append((athleteId, distance, time, date, timestamp))
                elif input['type'] == 'note':
                    note = input['note']
                    if note == '':
                        continue
                    note_input_params.append((athleteId, note, date, timestamp))
    
        #Insert time into rds, return the current users input ids
        if input_params:
            run_ids = execute_commit_fetch_all(
            """
                WITH inserted AS (
                    INSERT INTO athlete_time_inputs (athleteId, distance, time, date, timeStamp)
                    VALUES %s
                    RETURNING id, athleteId
                )
                SELECT id
                FROM inserted
                WHERE athleteId = %s
                ORDER BY id
            """, input_params, (user_id,)) or []

        #Insert rest time into rds
        if rest_input_params:
            rest_ids = execute_commit_fetch_all(
            """
                WITH inserted AS (
                    INSERT INTO athlete_rest_inputs (athleteId, restTime, date, timeStamp)
                    VALUES %s
                    RETURNING id, athleteId
                )
                SELECT id
                FROM inserted
                WHERE athleteId = %s
                ORDER BY id
            """, rest_input_params, (user_id,)) or []

        # Insert notes into rds
        if note_input_params:
            note_ids = execute_commit_fetch_all(
            """
                WITH inserted AS (
                    INSERT INTO athlete_note_inputs (athleteId, note, date, timeStamp)
                    VALUES %s
                    RETURNING id, athleteId
                )
                SELECT id
                FROM inserted
                WHERE athleteId = %s
                ORDER BY id
            """, note_input_params, (user_id,)) or []

        run_index = rest_index = note_index = 0
        # For each input, assign the corresponding inputId FOR THE USER THAT SUBMITTED IT to the input ids
        for i in range(len(inputs)):
            if inputs[i]['type'] == 'rest':
                inputs[i]['inputId'] = rest_ids[rest_index][0]
                rest_index += 1
            elif inputs[i]['type'] == 'note':
                inputs[i]['inputId'] = note_ids[note_index][0]
                note_index += 1
            elif inputs[i]['type'] == 'run':
                inputs[i]['inputId'] = run_ids[run_index][0]
                run_index += 1

        return {
            'statusCode': 200,
            'body': json.dumps(inputs),
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

