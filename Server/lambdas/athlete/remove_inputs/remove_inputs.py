import json
from rds import execute_commit

def remove_inputs(event, context):
    body = json.loads(event['body'])
    try:
        input_ids = body['inputIds']  # Expecting a list of input IDs to remove
        athlete_id = body['athleteId']  # Optional: If you want to restrict removal to a specific athlete
        # remove all inptus from db
        execute_commit(
            "DELETE FROM athlete_inputs WHERE id IN %s and athleteId = %s",
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