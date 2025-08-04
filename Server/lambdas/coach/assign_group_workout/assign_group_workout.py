from datetime import datetime, timezone
import json

from rds import execute_commit
from dynamo import get_item, put_item


def assign_group_workout(event, context):
    body = json.loads(event['body'])
    try:
        #Check if workout exists
        workout_title = body['title']
        coach_id = body['userId']
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))
        workout = get_item('Workouts', {'title': workout_title, 'coach_id': coach_id})
        if not workout:
            return {
                "statusCode": 404,
                "body": json.dumps({
                    "error": "Workout not found"
                })
            }
        group_name = body['groupName']
        
        # Create connection in RDS
        execute_commit("""
            INSERT INTO group_workouts (groupId, date, title)
            VALUES ((SELECT id FROM groups WHERE name = %s AND coachId = %s), %s, %s)
        """, (group_name, coach_id, date, workout_title))
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