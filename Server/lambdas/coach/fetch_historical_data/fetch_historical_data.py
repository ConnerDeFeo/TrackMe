import json
from rds import fetch_all
from user_auth import get_user_info
# Grabs all workouts and workout inputs for a given coach on a given date
def fetch_historical_data(event, context):
    # Extract query parameters from the incoming event
    query_params = event.get('queryStringParameters', {})

    try:
        # Get authenticated user info and determine coach ID
        user_info = get_user_info(event)
        coach_id = user_info['userId']
        # Expecting 'date' parameter for historical lookup
        date = query_params['date']

        # Fetch all workouts assigned to this coach on the given date
        workouts = fetch_all(
            """
                SELECT g.id, g.name, w.title, w.description, w.sections 
                FROM group_workouts gw
                JOIN groups g ON gw.groupId = g.id
                JOIN workouts w ON gw.workoutId = w.id
                WHERE gw.date = %s AND g.coachId = %s
            """,
            (date, coach_id)
        ) or []

        # Fetch all athlete input entries for this coach on the same date
        athlete_inputs = fetch_all(
            """
                SELECT g.id, g.name, a.userId, a.username, ai.time, ai.distance, ai.restTime, ai.type
                FROM athlete_inputs ai
                JOIN athletes a ON ai.athleteId = a.userId
                JOIN groups g ON ai.groupId = g.id
                WHERE ai.date = %s AND g.coachId = %s
                ORDER BY ai.timeStamp ASC
            """,
            (date, coach_id)
        ) or []

        # Prepare a dictionary to group data by group ID
        filtered_data = {}

        # Populate filtered_data with workout details per group
        for group_id, group_name, title, description, sections in workouts:
            if group_id not in filtered_data:
                filtered_data[group_id] = {
                    "name": group_name,
                    "workouts": [],
                    "athleteInputs": {}
                }
            # Append workout metadata
            filtered_data[group_id]["workouts"].append({
                "title": title,
                "description": description,
                "sections": sections
            })

        # Populate filtered_data with athlete inputs per group and athlete
        for group_id, group_name, user_id, username, time, distance, rest_time, input_type in athlete_inputs:
            # Ensure the group entry exists
            if group_id not in filtered_data:
                filtered_data[group_id] = {
                    "name": group_name,
                    "workouts": [],
                    "athleteInputs": {}
                }
            # Initialize athlete entry if not present
            if user_id not in filtered_data[group_id]["athleteInputs"]:
                filtered_data[group_id]["athleteInputs"][user_id] = {
                    "username": username,
                    "inputs": []
                }
            # Distinguish input type: rest or performance
            if rest_time:
                filtered_data[group_id]["athleteInputs"][user_id]["inputs"].append({
                    "restTime": rest_time,
                    "type": input_type
                })
            else:
                filtered_data[group_id]["athleteInputs"][user_id]["inputs"].append({
                    "time": time,
                    "distance": distance,
                    "type": input_type
                })

        # Return the assembled data as a JSON response
        return {
            "statusCode": 200,
            "body": json.dumps(filtered_data)
        }

    except Exception as e:
        print(f"Error occurred while fetching historical data: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"})
        }