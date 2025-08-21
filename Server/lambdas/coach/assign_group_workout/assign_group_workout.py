from datetime import datetime, timezone
import json

from rds import execute_commit


def assign_group_workout(event, context):
    body = json.loads(event['body'])
    try:
        #Check if workout exists
        workout_id = body['workoutId']
        coach_id = body['coachId']
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))
        group_id = body['groupId']

        # Create connection in RDS
        execute_commit(
        """
            DELETE FROM group_workouts WHERE groupId = %s AND date = %s AND workoutId = %s;
            INSERT INTO group_workouts (groupId, date, workoutId)
            VALUES (%s, %s, %s)
        """, (group_id, date, workout_id, group_id, date, workout_id))
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "message": "Group workout assigned successfully"
            })
        }
    except Exception as e:
        print(f"Error assigning group workout: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e)
            })
        }