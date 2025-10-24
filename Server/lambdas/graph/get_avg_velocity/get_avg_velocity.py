from datetime import datetime, timezone
import json
from user_auth import get_user_info, get_auth_header
from rds import fetch_all

def get_avg_velocity(event, context):
    auth_header = get_auth_header()
    query_params = event.get('queryStringParameters', {}) or {}
    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        # Fetch total work and rest times for the given date
        results = fetch_all(
            """
                SELECT time, distance, date
                FROM athlete_time_inputs
                WHERE athleteId = %s 
                AND date <= %s
                AND date IN (
                    SELECT DISTINCT date
                    FROM athlete_time_inputs
                    WHERE athleteId = %s AND date <= %s
                    ORDER BY date DESC
                    LIMIT 30
                )
                ORDER BY date ASC
            """,
            (user_id, date, user_id, date)
        ) or []
        
        avg_velocity_ratios = []
        current_date = None
        current_total_work = 0
        current_total_distance = 0

        def append_ratio(work, ditsance):
            if ditsance == 0 or current_date is None:
                return 
            avg_velocity_ratios.append({
                "date": current_date,
                "avgVelocity": work / float(ditsance)
            })
        for time, distance, input_date in results:
            if input_date != current_date:
                append_ratio(current_total_work, current_total_distance)
                current_total_work = 0
                current_total_distance = 0
            current_date = input_date
            current_total_work += time if time else 0
            current_total_distance += distance if distance else 0
        # Handle the last date
        append_ratio(current_total_work, current_total_distance)

        print(avg_velocity_ratios)
        return {
            "statusCode": 200,
            "body": json.dumps(avg_velocity_ratios),
            "headers": auth_header
        }
    except Exception as e:
        print(f"Error occurred while getting average velocity: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"}),
            "headers": auth_header
        }