import json
from datetime import datetime, timezone
from rds import fetch_all

def view_workout_inputs(event, context):
    body = json.loads(event['body'])

    try:
        user_id = body['userId']
        username = body['username']
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        data = []
        #The first querey will grab all workout group inputs that this person is a part of
        # The data returned should look something like:
        # [[groupName, coachUsername, workoutGroupName, distance, time], [groupName, coachUsername, workoutGroupName, distance, time],
        group_workout_inputs = fetch_all(
        """
            SELECT g.name, c.username, wg.workoutGroupName, wgi.distance, wgi.time
            FROM groups g 
            JOIN coaches c ON g.coachId = c.userId
            JOIN group_workouts gw ON gw.groupId = g.id
            JOIN workout_groups wg ON wg.workoutId = gw.id
            JOIN workout_group_members wgm ON wgm.workoutGroupId = wg.id
            JOIN workout_group_inputs wgi ON wgi.workoutGroupId = wg.id
            WHERE wgm.athleteUsername = %s AND gw.date = %s
        """, (username, date))
        data.extend(group_workout_inputs)

        #Next grab all inputs for this athlete in the specified group, data should look like:
        # [[groupName, coachUsername, distance, time], [groupName, coachUsername, distance, time]]
        athlete_inputs = fetch_all(
        """
            SELECT g.name, c.username, agi.distance, agi.time
            FROM groups g
            JOIN coaches c ON g.coachId = c.userId  
            JOIN group_workouts gw ON gw.groupId = g.id
            JOIN athlete_workout_inputs agi ON agi.groupWorkoutId = gw.id
            WHERE agi.athleteId = %s AND gw.date = %s
        """, (user_id, date))
        data.extend(athlete_inputs)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'http://localhost:8081',
                'Access-Control-Allow-Credentials': True,
                "Content-Type": "application/json"
            },
            'body': json.dumps(data)
        }
    except Exception as e:
        print(f"Error viewing inputs: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': 'http://localhost:8081',
                'Access-Control-Allow-Credentials': True,
                "Content-Type": "application/json"
            },
            'body': json.dumps({"message": "Internal server error", "error": str(e)}),
        }
    