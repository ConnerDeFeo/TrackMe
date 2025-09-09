import json
from rds import fetch_all

# Fetch group workout history for a given coach for the 7 most recent distinct dates of group workouts
def view_group_history(event, context):
    query_params = event.get('queryStringParameters', {})
    try:
        coach_id = query_params['coachId']
    except Exception as e:
        print(f"Error occurred while viewing group history: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"})
        }