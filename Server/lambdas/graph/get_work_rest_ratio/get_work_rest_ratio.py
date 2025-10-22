from user_auth import get_user_info, get_auth_header
from rds import fetch_all
import json
from datetime import datetime, timezone

# Gets the average work time to rest time ratio for the user for their past 30 workouts
def get_work_rest_ratio(event, context):
    auth_header = get_auth_header()
    query_params = event.get('queryStringParameters', {})
    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        # Fetch total work and rest times for the given date
        results = fetch_all(
            """
                SELECT time, restTime, date
                FROM athlete_inputs
                WHERE athleteId = %s AND date <= %s
                ORDER BY date ASC
                LIMIT 30
            """,
            (user_id, date)
        ) or []
        
        work_rest_ratios = []
        current_date = None
        current_total_work = 0
        current_total_rest = 0

        def append_ratio(work, rest):
            if rest == 0 or current_date is None:
                return 
            work_rest_ratios.append({
                "date": current_date,
                "workRestRatio": work / float(rest)
            })
        for time, restTime, input_date in results:
            if input_date != current_date:
                append_ratio(current_total_work, current_total_rest)
                current_total_work = 0
                current_total_rest = 0
            current_date = input_date
            current_total_work += time if time else 0
            current_total_rest += restTime if restTime else 0
        # Handle the last date
        append_ratio(current_total_work, current_total_rest)

        print(work_rest_ratios)
        return {
            "statusCode": 200,
            "body": json.dumps(work_rest_ratios),
            "headers": auth_header
        }
    except Exception as e:
        print(f"Error occurred while getting work-rest ratio: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"}),
            "headers": auth_header
        }
