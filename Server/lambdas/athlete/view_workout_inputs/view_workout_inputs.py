import json
from datetime import datetime, timezone
from rds import fetch_all


# What up
def view_workout_inputs(event, context):
    """
    Retrieves workout inputs for an athlete from both group workouts and individual workouts.
    This function fetches workout data (distance and time) for a specific athlete on a given date,
    organizing the results into group workouts and individual workouts.
    
    Args:
        event (dict): AWS Lambda event object containing query string parameters:
            - userId (str): The athlete's user ID for individual workout lookups
            - username (str): The athlete's username for group workout lookups  
            - date (str, optional): Date in YYYY-MM-DD format. Defaults to current UTC date
        context: AWS Lambda context object (unused in this function)
    
    Returns:
        dict: HTTP response object with:
            - statusCode (int): 200 for success, 404 for no data found, 500 for errors
            - body (str): JSON string containing:
                Success (200): 
                    - groups (dict): Group workout inputs organized by group ID
                    - individuals (dict): Individual workout inputs organized by group ID
                    Each workout input contains distance and time values
                Not Found (404):
                    - message: "No workout inputs found"
                Error (500):
                    - message: "Internal server error"
                    - error: Detailed error description
    
    Raises:
        Exception: Any database or processing errors are caught and returned as 500 status
    
    Note:
        Requires fetch_all function to be available for database queries.
        Uses datetime, timezone, and json modules.
    """
    # Extract query parameters from the event
    query_params = event.get('queryStringParameters', {})

    try:
        # Get required parameters
        user_id = query_params.get('userId')
        username = query_params.get('username')
        # Default to current UTC date if no date provided
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        # Initialize data structure to hold workout inputs
        grouped_data = {}

        # Fetch group workout inputs for the athlete
        group_workout_inputs = fetch_all(
        """
            SELECT g.id, wg.workoutGroupName, wgi.distance, wgi.time
            FROM groups g
            JOIN workout_groups wg ON wg.groupId = g.id
            JOIN workout_group_members wgm ON wgm.workoutGroupId = wg.id
            JOIN workout_group_inputs wgi ON wgi.workoutGroupId = wg.id
            WHERE wgm.athleteUsername = %s AND wg.date = %s
        """, (username, date))

        # Process group workout inputs if any exist
        if group_workout_inputs:
            grouped_data['groups'] = {}
            for input in group_workout_inputs:
                id = input[0]
                if id not in grouped_data['groups']:
                    grouped_data['groups'][id] = []
                grouped_data['groups'][id].append({"distance": input[2], "time": input[3]})

        
        athlete_inputs = fetch_all(
        """
            SELECT g.id, agi.distance, agi.time
            FROM groups g
            JOIN athlete_workout_inputs agi ON agi.groupId = g.id
            WHERE agi.athleteId = %s AND agi.date = %s
        """, (user_id, date))

        if athlete_inputs:
            grouped_data['individuals'] = {}
            for input in athlete_inputs:
                id = input[0]
                if id not in grouped_data['individuals']:
                    grouped_data['individuals'][id] = []
                grouped_data['individuals'][id].append({"distance": input[1], "time": input[2]})

        if len(grouped_data) > 0:
            return {
                'statusCode': 200,
                'body': json.dumps(grouped_data)
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
    