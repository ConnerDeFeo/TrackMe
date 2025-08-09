import json
from dynamo import get_item

#Fetches all of a given coaches workouts
def get_workouts(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        coach_id = query_params['coach_id']

    except Exception as e:
        print(f"Error parsing input: {e}")
        return {
            "statusCode": 500,
            "body": f"Error fetching workouts: {str(e)}"
        }
