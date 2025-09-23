import json
from datetime import datetime, timezone
from rds import fetch_all
from user_auth import get_user_info


# Gets all athlete inputs for a given day
def view_workout_inputs(event, context):
    # Extract query parameters from the event
    query_params = event.get('queryStringParameters', {})

    try:
        # Get required parameters
        user_info = get_user_info(event)
        athlete_id = user_info['user_id']
        # Default to current UTC date if no date provided
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))
        
        athlete_inputs = fetch_all(
        """
            SELECT g.id, ai.distance, ai.time, ai.id
            FROM groups g
            JOIN athlete_inputs ai ON ai.groupId = g.id
            WHERE ai.athleteId = %s AND ai.date = %s
        """, (athlete_id, date))

        # Initialize data structure to hold workout inputs
        parsed_data = {}
        if athlete_inputs:
            for input in athlete_inputs:
                id = input[0]
                if id not in parsed_data:
                    parsed_data[id] = []
                parsed_data[id].append({"distance": input[1], "time": input[2], "inputId": input[3]})

        if len(parsed_data) > 0:
            return {
                'statusCode': 200,
                'body': json.dumps(parsed_data)
            }
        return {
            'statusCode': 404,
            'body': json.dumps({"message": "No workout inputs found"})
        }
    except Exception as e:
        print(f"Error viewing inputs: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({"message": "Internal server error", "error": str(e)}),
        }
    