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
            SELECT id, distance, time, restTime, note, type
            FROM athlete_inputs
            WHERE athleteId = %s AND date = %s
            ORDER BY timeStamp ASC
        """, (athlete_id, date))

        # Initialize data structure to hold workout inputs
        parsed_data = []
        if athlete_time_inputs:
            for input_id, distance, time, rest_time, note, input_type in athlete_time_inputs:
                if rest_time:
                    parsed_data.append({"restTime": rest_time, "type": "rest", "inputId": input_id})
                elif note:
                    parsed_data.append({"note": note, "type": "note", "inputId": input_id})
                elif time and distance:
                    parsed_data.append({"distance": distance, "time": time, "type": input_type, "inputId": input_id})
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