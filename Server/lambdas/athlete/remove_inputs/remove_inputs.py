import json
from rds import execute_commit
from user_auth import get_user_info

def remove_inputs(event, context):
    body = json.loads(event['body'])
    try:
        user_info = get_user_info(event)
        athlete_id = user_info["userId"]
        input_ids = body['inputIds']  # Expecting a list of input IDs to remove
        # remove all inputs from db
        execute_commit(
            "DELETE FROM athlete_inputs WHERE id IN %s AND athleteId = %s",
            (tuple(input_ids), athlete_id)
        )

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