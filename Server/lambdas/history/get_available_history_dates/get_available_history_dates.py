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

        params = [user_id, user_id]
        # Determine the appropriate join clause based on account type
        if account_type == "Athlete":
            # Athletes can only access their own history
            workout_join_clause = "JOIN athlete_groups ag ON g.id = ag.groupId WHERE ag.athleteId = %s"
            input_join_clause = " WHERE ai.athleteId = %s"
        else:
            # Coaches can access history for all their athletes
            workout_join_clause = "WHERE g.coachId = %s"
            # Only get athlete inputs from athletes in the coach's groups
            input_join_clause = """
                    JOIN user_relations ur ON ai.athleteId = ur.userId AND ur.relationId = %s
                    JOIN user_relations ur2 ON ai.athleteId = ur2.relationId AND ur2.userId = %s
                """
            params.append(user_id)
        params.append(date)
        # Fetch distinct dates that have assigned workouts or athlete inputs for the coach's groups
        dates = fetch_all(
        f"""
            SELECT DISTINCT date
            FROM (
                SELECT gw.date
                FROM group_workouts gw
                JOIN groups g ON gw.groupId = g.id
                {workout_join_clause}

                UNION

                SELECT ai.date
                FROM athlete_inputs ai
                {input_join_clause}
            ) AS combined
            WHERE date <= %s
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