import json
from datetime import datetime, timezone
from rds import execute_commit_many

def create_workout_group(event,context):
    body = json.loads(event['body'])

    try:
        leaderId = body['leaderId']
        other_athletes = body['other athletes']
        group_name = body['groupName']
        workout_title = body['workoutTitle']
        coach_username = body['coachUsername']
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

    except Exception as e:
        print(f"Error creating workout group: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({"message": "Internal server error", "error": str(e)})
        }
