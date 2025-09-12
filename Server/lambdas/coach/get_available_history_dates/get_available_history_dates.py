import json
from rds import fetch_all
from datetime import datetime, timezone

# Fetches dates for a given coach where there is a workout
def get_available_history_dates(event, context):
    query_params = event.get('queryStringParameters', {})
    try:
        coach_id = query_params['coachId']
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        # Fetch distinct dates that have assigned workouts or athlete inputs for the coach's groups
        dates = fetch_all("""
            SELECT DISTINCT gw.date
            FROM group_workouts gw
            JOIN groups g ON gw.groupId = g.id
            WHERE g.coachId = %s
            AND gw.date <= %s
            ORDER BY gw.date DESC
            LIMIT 7
        """, (coach_id, date)) or []

        return {
            "statusCode": 200,
            "body": json.dumps([str(d[0]) for d in dates])
        }

    except Exception as e:
        print(f"Error occurred while getting available history dates: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"})
        }