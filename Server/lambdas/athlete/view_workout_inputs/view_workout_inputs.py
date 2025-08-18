import json
from datetime import datetime, timezone
from rds import fetch_all

def view_workout_inputs(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        user_id = query_params.get('userId')
        username = query_params.get('username')
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        data = []
        #The first querey will grab all workout group inputs that this person is a part of
        # The data returned should look something like:
        # [[groupId, workoutGroupName, distance, time], [groupId, workoutGroupName, distance, time],
        group_workout_inputs = fetch_all(
        """
            SELECT g.id, wg.workoutGroupName, wgi.distance, wgi.time
            FROM groups g
            JOIN coaches c ON g.coachId = c.userId
            JOIN group_workouts gw ON gw.groupId = g.id
            JOIN workout_groups wg ON wg.workoutId = gw.id
            JOIN workout_group_members wgm ON wgm.workoutGroupId = wg.id
            JOIN workout_group_inputs wgi ON wgi.workoutGroupId = wg.id
            WHERE wgm.athleteUsername = %s AND gw.date = %s
        """, (username, date))
        if group_workout_inputs:
            data.extend(group_workout_inputs)

        # Next grab all inputs for this athlete in the specified group, data should look like:
        # [[groupId, distance, time], [groupId, distance, time]]
        athlete_inputs = fetch_all(
        """
            SELECT g.id, agi.distance, agi.time
            FROM groups g
            JOIN coaches c ON g.coachId = c.userId  
            JOIN group_workouts gw ON gw.groupId = g.id
            JOIN athlete_workout_inputs agi ON agi.groupWorkoutId = gw.id
            WHERE agi.athleteId = %s AND gw.date = %s
        """, (user_id, date))

        if athlete_inputs:
            data.extend(athlete_inputs)

        if len(data) > 0:
            return {
                'statusCode': 200,
                'body': json.dumps(data)
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
    