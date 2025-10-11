import json
from rds import fetch_all
from datetime import datetime, timezone
from user_auth import get_user_info, get_auth_header

# Fetches dates for a given coach where there is a workout
def get_available_history_dates(event, context):
    query_params = event.get('queryStringParameters')
    auth_header = get_auth_header()

    if not query_params:
        query_params = {}

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        account_type = user_info['accountType']
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        # Fetch distinct dates that have assigned workouts or athlete inputs for the coach's groups
        if account_type == "Coach":
                dates = fetch_all(
                """
                    SELECT DISTINCT date
                    FROM (
                        SELECT gw.date
                        FROM group_workouts gw
                        JOIN groups g ON gw.groupId = g.id
                        WHERE g.coachId = %s

                        UNION

                        SELECT ai.date
                        FROM athlete_inputs ai
                        JOIN groups g ON ai.groupId = g.id
                        WHERE g.coachId = %s
                    ) AS combined
                    WHERE date <= %s
                    ORDER BY date DESC
                    LIMIT 7;
                """, (user_id, user_id, date)) or []
        else:
            dates = fetch_all(
                """
                    SELECT DISTINCT date
                    FROM (
                        SELECT gw.date
                        FROM group_workouts gw
                        JOIN groups g ON gw.groupId = g.id
                        JOIN athlete_groups ag ON g.id = ag.groupId
                        WHERE ag.athleteId = %s

                        UNION

                        SELECT ai.date
                        FROM athlete_inputs ai
                        JOIN groups g ON ai.groupId = g.id
                        JOIN athlete_groups ag ON g.id = ag.groupId
                        WHERE ag.athleteId = %s
                    ) AS combined
                    WHERE date <= %s
                    ORDER BY date DESC
                    LIMIT 7;
                """, (user_id, user_id, date)) or []

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