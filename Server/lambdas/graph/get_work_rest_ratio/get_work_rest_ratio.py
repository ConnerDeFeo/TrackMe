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
        account_type = user_info['accountType']
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        if account_type == "Athlete":
            join_clause = "WHERE athleteId = %s"
            date_subquery = "WHERE athleteId = %s"
        else:
            join_clause = """
                WHERE athleteId IN (
                    SELECT ur.relationId
                    FROM user_relations ur
                    JOIN user_relations ur2 ON ur.relationId = ur2.userId
                    WHERE ur.userId = %s AND ur2.relationId = ur.userId
                )
            """
            date_subquery = """
                WHERE athleteId IN (
                    SELECT ur.relationId
                    FROM user_relations ur
                    JOIN user_relations ur2 ON ur.relationId = ur2.userId
                    WHERE ur.userId = %s AND ur2.relationId = ur.userId
                )
            """

        # Fetch total work and rest times for the given date
        results = fetch_all(
            f"""
                SELECT time, restTime, date
                FROM athlete_inputs
                {join_clause}
                AND date <= %s
                AND date IN (
                    SELECT DISTINCT date
                    FROM athlete_inputs
                    {date_subquery} AND date <= %s
                    ORDER BY date DESC
                    LIMIT 30
                )
                ORDER BY date ASC
            """,
            (user_id, date, user_id, date)
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
