import json
from rds import fetch_all

# Fetches dates for a given coach where there is a workout or a input for a group by one of their athletes
def get_available_history_dates(event, context):
    query_params = event.get('queryStringParameters', {})
    try:
        coach_id = query_params['coachId']



    except Exception as e:
        print(f"Error occurred while getting available history dates: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"})
        }