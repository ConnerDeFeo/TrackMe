import json
from rds import execute_commit
from user_auth import get_user_info, post_auth_header

def remove_inputs(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:
        user_info = get_user_info(event)
        athlete_id = user_info["userId"]
        input_ids = body['inputIds']  # {inputId: int, type:string}[]

        input_time_params = [input_id['inputId'] for input_id in input_ids if input_id['type'] == 'run']
        input_rest_params = [input_id['inputId'] for input_id in input_ids if input_id['type'] == 'rest']

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
            'body': json.dumps({'message': 'Inputs removed successfully'}),
            'headers': auth_header
        }
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': f'Error: {str(e)}'}),
            'headers': auth_header
        }