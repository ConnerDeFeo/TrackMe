import json
from rds import fetch_all
from datetime import datetime, timezone

# Grabs the given date's input history for the given athlete from the database
# Also grabs the 6 preceding inputs 
def search_input_history_date(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        athlete_id = query_params['athleteId']
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        # Grab given data and 6 preceding dates' input history for the athlete
        input_history = fetch_all(
            """
                SELECT g.id, g.name, ai.date, ai.distance, ai.time
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
                ORDER BY date DESC
            """,
            (athlete_id,athlete_id, date)
        )

        # Convert inputs into a easy to read format for the frontend
        if input_history is None:
            input_history = []
            
        # sort input history by date and group id
        sorted = {}
        for input in input_history:
            group_id = input[0]
            date = input[2]
            if date not in sorted:
                sorted[date] = {}
            if group_id not in sorted[date]:
                sorted[date][group_id] = {}
                sorted[date][group_id]['name'] = input[1]
                sorted[date][group_id]['inputs'] = []
            sorted[date][group_id]['inputs'].append({
                "distance": input[3],
                "time": input[4]
            })
        return {
            "statusCode": 200,
            "body": json.dumps(sorted)
        }
    except Exception as e:
        print(f"Error occurred while searching input history by date: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": "Internal server error"
            })
        }