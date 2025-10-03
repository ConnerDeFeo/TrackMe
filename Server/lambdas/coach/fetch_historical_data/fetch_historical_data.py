import json
from rds import fetch_all
from user_auth import get_user_info
# Grabs all workouts and workout inputs for a given coach on a given date
def fetch_historical_data(event, context):
    query_params = event.get('queryStringParameters', {})
    try:
        user_info = get_user_info(event)
        coach_id = user_info['userId']
        date = query_params['date']

        # Grab all workouts for the given coach on the specified date
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
        
        # Grab all athlete inputs for the given coach on the specified date
        athlete_inputs = fetch_all(
            """
                SELECT g.id, g.name, a.userId, a.username, ati.time, ati.distance 
                FROM athlete_inputs ati
                JOIN athletes a ON ati.athleteId = a.userId
                JOIN groups g ON ati.groupId = g.id
                WHERE ati.date = %s AND g.coachId = %s
            """,
            (date, coach_id)
        ) or []

        filtered_data = {}
        for workout in workouts:
            group_id = workout[0]
            if group_id not in filtered_data:
                filtered_data[group_id] = {
                    "name": workout[1],
                    "workouts": [],
                    "athleteInputs": {}
                }
            filtered_data[group_id]["workouts"].append({
                "title": workout[2],
                "description": workout[3],
                "sections": workout[4]
            })
        for input in athlete_inputs:
            group_id = input[0]
            if group_id not in filtered_data:
                filtered_data[group_id] = {
                    "name": input[1],
                    "workouts": [],
                    "athleteInputs": {}
                }
            if not input[2] in filtered_data[group_id]["athleteInputs"]:
                filtered_data[group_id]["athleteInputs"][input[2]] = {
                    "username": input[3],
                    "inputs": []
                }
            filtered_data[group_id]["athleteInputs"][input[2]]["inputs"].append({
                "time": input[4],
                "distance": input[5]
            })
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