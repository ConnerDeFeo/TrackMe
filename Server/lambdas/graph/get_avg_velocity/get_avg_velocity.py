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
        account_type = user_info['accountType']
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        if account_type == "Athlete":
            join_clause = """
                WHERE athleteId = %s
                AND date <= %s
                AND date IN (
                    SELECT DISTINCT date
                    FROM athlete_time_inputs
                    WHERE athleteId = %s AND date <= %s
                    ORDER BY date DESC
                    LIMIT 30
                )    
            """
        else:
            join_clause = """
                WHERE athleteId IN (
                    SELECT ur.relationId
                    FROM user_relations ur
                    JOIN user_relations ur2 ON ur.relationId = ur2.userId
                    WHERE ur.userId = %s AND ur2.relationId = ur.userId
                )
                AND date <= %s
                AND date IN (
                    SELECT DISTINCT date
                    FROM athlete_time_inputs
                    WHERE athleteId IN (
                        SELECT ur.relationId
                        FROM user_relations ur
                        JOIN user_relations ur2 ON ur.relationId = ur2.userId
                        WHERE ur.userId = %s AND ur2.relationId = ur.userId
                    )
                    AND date <= %s
                    ORDER BY date DESC
                    LIMIT 30
                )   
            """

        # Fetch total work and rest times for the given date
        results = fetch_all(
            f"""
                SELECT time, distance, date
                FROM athlete_time_inputs
                {join_clause}
                ORDER BY date ASC
            """,
            (user_id, date, user_id, date)
        ) or []
        avg_velocity_ratios = []
        current_date = None
        current_total_time = 0
        current_total_distance = 0

        def append_ratio(time, distance):
            if time == 0 or current_date is None:
                return
            avg_velocity_ratios.append({
                "date": current_date,
                "avgVelocity": distance / float(time)
            })
        for time, distance, input_date in results:
            if input_date != current_date:
                append_ratio(current_total_time, current_total_distance)
                current_total_time = 0
                current_total_distance = 0
            current_date = input_date
            current_total_time += time if time else 0
            current_total_distance += distance if distance else 0
        # Handle the last date
        append_ratio(current_total_time, current_total_distance)

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