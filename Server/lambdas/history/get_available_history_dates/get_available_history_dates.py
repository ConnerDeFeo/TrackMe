import json
from rds import fetch_all
from datetime import datetime, timezone
from user_auth import get_user_info, get_auth_header

# Fetches available history dates for a given month year
def get_available_history_dates(event, context):
    query_params = event.get('queryStringParameters')
    auth_header = get_auth_header()

    if not query_params:
        query_params = {}

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        account_type = user_info['accountType']
        yyyyMM = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m"))
        distanceFilters = query_params.get('distanceFilters', None) # comma seperated list of distances
        if distanceFilters:
            distanceFilters = distanceFilters.split(",")
        queryDate = yyyyMM + "%"

        params = [user_id]
        # Determine the appropriate join clause based on account type
        if account_type == "Athlete":
            join_clause = " WHERE ai.athleteId = %s AND date LIKE %s"
        else:
            # Only get athlete inputs from athletes in the coach's groups
            join_clause = """
                    JOIN user_relations ur ON ai.athleteId = ur.userId AND ur.relationId = %s
                    JOIN user_relations ur2 ON ai.athleteId = ur2.relationId AND ur2.userId = %s
                    WHERE date LIKE %s
                """
            params.append(user_id)
        params.append(queryDate)

        if distanceFilters:
            join_clause += f" AND ai.distance IN %s"
            params.append(tuple(distanceFilters))
        # Fetch distinct dates that have assigned workouts or athlete inputs for the coach's groups
        dates = fetch_all(
        f"""
            SELECT DISTINCT date
            FROM athlete_inputs ai
            {join_clause}
            ORDER BY date DESC
            LIMIT 7;
        """, params) or []

        return {
            "statusCode": 200,
            "body": json.dumps([str(d[0]) for d in dates]),
            "headers": auth_header
        }

    except Exception as e:
        print(f"Error occurred while getting available history dates: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"}),
            "headers": auth_header
        }