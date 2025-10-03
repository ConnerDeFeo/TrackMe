import json
from rds import execute_commit
from user_auth import get_user_info

def remove_inputs(event, context):
    body = json.loads(event['body'])
    try:
        user_info = get_user_info(event)
        athlete_id = user_info["userId"]
        input_ids = body['inputIds']  # {inputId: int, type:string}[]

        input_time_params = [input_id[0] for input_id in input_ids if input_id[1] == 'run']
        input_rest_params = [input_id[0] for input_id in input_ids if input_id[1] == 'rest']
        print(f"Removing inputs {input_ids} for athlete {athlete_id}")

        # remove all inputs from db
        execute_commit(
            """
                DELETE FROM athlete_time_inputs WHERE id IN %s AND athleteId = %s
            """,
        (tuple(input_time_params), athlete_id))

        execute_commit(
            """
                DELETE FROM athlete_rest_inputs WHERE id IN %s AND athleteId = %s
            """,
        (tuple(input_rest_params), athlete_id))


        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Inputs removed successfully'})
        }
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': f'Error: {str(e)}'})
        }