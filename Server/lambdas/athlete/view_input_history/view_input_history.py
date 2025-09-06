import json
from rds import fetch_all

# Fetches workout history for a given athlete
def view_input_history(event, context):
    query_params = event.get("queryStringParameters", {})

    try:
        athlete_id = query_params['athleteId']

        # Fetch input history from the database for the specified athlete
        input_history = fetch_all(
            """
                SELECT g.id, g.name, ai.date, ai.distance, ai.time
                FROM athlete_inputs ai
                JOIN groups g ON ai.groupId = g.id
                WHERE ai.athleteId = %s
                ORDER BY ai.date ASC, ai.id ASC
            """,
            (athlete_id,)
        )

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
        print(f"Error occurred while fetching input history: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal server error"})
        }