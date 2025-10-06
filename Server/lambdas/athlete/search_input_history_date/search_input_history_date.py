import json
from rds import fetch_all
from datetime import datetime, timezone
from user_auth import get_user_info, get_auth_header

# Grabs the given date's input history for the given athlete from the database
# Also grabs the 6 preceding inputs 
def search_input_history_date(event, context):
    query_params = event.get('queryStringParameters')
    auth_header = get_auth_header()

    if not query_params:
        query_params = {}

    try:
        user_info = get_user_info(event)
        athlete_id = user_info['userId']
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        # Grab given data and 6 preceding dates' input history for the athlete
        input_history = fetch_all(
            """
                SELECT g.id, g.name, ai.date, ai.distance, ai.time, ai.restTime, ai.type
                FROM athlete_inputs ai
                JOIN groups g ON ai.groupId = g.id
                WHERE athleteId = %s 
                AND date IN (
                    SELECT DISTINCT date
                    FROM athlete_inputs
                        WHERE athleteId = %s AND date <= %s
                        ORDER BY date DESC 
                        LIMIT 7
                )
                ORDER BY date DESC,
                ai.timeStamp ASC
            """,
            (athlete_id, athlete_id, date)
        )

        # Convert inputs into a easy to read format for the frontend
        if input_history is None:
            input_history = []
            
        # sort input history by date and group id
        sorted = {}
        for group_id, group_name, input_date, distance, time, rest_time, input_type in input_history:
            if input_date not in sorted:
                sorted[input_date] = {}
            if group_id not in sorted[input_date]:
                sorted[input_date][group_id] = {}
                sorted[input_date][group_id]['name'] = group_name
                sorted[input_date][group_id]['inputs'] = []
            if rest_time:
                sorted[input_date][group_id]['inputs'].append({
                    "restTime": rest_time,
                    "type": input_type
                })
            else:
                sorted[input_date][group_id]['inputs'].append({
                    "distance": distance,
                    "time": time,
                    "type": input_type
                })
        return {
            "statusCode": 200,
            "body": json.dumps(sorted),
            "headers": auth_header
        }
    except Exception as e:
        print(f"Error occurred while searching input history by date: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": "Internal server error"
            }),
            "headers": auth_header
        }