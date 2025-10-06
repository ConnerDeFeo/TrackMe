import json
from datetime import datetime, timezone
from rds import fetch_all
from user_auth import get_user_info, get_auth_header


# Gets all athlete inputs for a given day
def view_workout_inputs(event, context):
    # Extract query parameters from the event
    query_params = event.get('queryStringParameters', {})
    auth_header = get_auth_header()

    try:
        # Get required parameters
        user_info = get_user_info(event)
        athlete_id = user_info["userId"]
        # Default to current UTC date if no date provided
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))
        
        athlete_time_inputs = fetch_all(
        """
            SELECT g.id, ai.id, ai.distance, ai.time, ai.restTime, ai.type
            FROM groups g
            JOIN athlete_inputs ai ON ai.groupId = g.id
            WHERE ai.athleteId = %s AND ai.date = %s
            ORDER BY ai.timeStamp ASC
        """, (athlete_id, date))

        # Initialize data structure to hold workout inputs
        parsed_data = {}
        if athlete_time_inputs:
            for group_id, input_id, distance, time, rest_time, input_type in athlete_time_inputs:
                if group_id not in parsed_data:
                    parsed_data[group_id] = []
                if rest_time:
                    parsed_data[group_id].append({"restTime": rest_time, "type": "rest", "inputId": input_id})
                else:
                    parsed_data[group_id].append({"distance": distance, "time": time, "type": input_type, "inputId": input_id})
        if len(parsed_data) > 0:
            return {
                'statusCode': 200,
                'body': json.dumps(parsed_data),
                'headers': auth_header
            }
        return {
            'statusCode': 404,
            'body': json.dumps({"message": "No workout inputs found"}),
            'headers': auth_header
        }
    except Exception as e:
        print(f"Error viewing inputs: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({"message": "Internal server error", "error": str(e)}),
            'headers': auth_header
        }
    