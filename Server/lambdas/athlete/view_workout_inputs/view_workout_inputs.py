import json
from datetime import datetime, timezone
from rds import fetch_all


# What up
def view_workout_inputs(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        user_id = query_params.get('userId')
        username = query_params.get('username')
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        grouped_data = {}

        group_workout_inputs = fetch_all(
        """
            SELECT g.id, wg.workoutGroupName, wgi.distance, wgi.time
            FROM groups g
            JOIN workout_groups wg ON wg.groupId = g.id
            JOIN workout_group_members wgm ON wgm.workoutGroupId = wg.id
            JOIN workout_group_inputs wgi ON wgi.workoutGroupId = wg.id
            WHERE wgm.athleteUsername = %s AND wg.date = %s
        """, (username, date))

       
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
    