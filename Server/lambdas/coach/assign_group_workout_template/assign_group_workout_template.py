from datetime import datetime, timezone
import json
from rds import execute_commit
from user_auth import get_user_info, post_auth_header

def assign_group_workout_template(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()
    try:
        user_info = get_user_info(event)
        coach_id = user_info["userId"]
        #Check if workout exists
        workout_id = body['workoutId']
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))
        group_id = body['groupId']

        # Create connection in RDS
        execute_commit(
        """
            INSERT INTO group_workouts (groupId, date, workoutId)
            SELECT %s, %s, %s
            FROM groups
            WHERE coachId = %s AND id = %s
        """, (group_id, date, workout_id, coach_id, group_id))
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "message": "Group workout assigned successfully"
            }),
            "headers": auth_header
        }
    except Exception as e:
        print(f"Error assigning group workout: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e)
            }),
            "headers": auth_header
        }