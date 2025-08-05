from datetime import datetime, timezone
from dynamo import get_item
from rds import fetch_one
from decimal_encoder import DecimalEncoder
import json

def view_workout_athlete(event, context):
    body = json.loads(event['body'])
    workout_not_found = {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': 'http://localhost:8081',
                    'Access-Control-Allow-Credentials': True,
                    "Content-Type": "application/json"
                },
                'body': json.dumps({"message": "Workout not found"}),
            }
    
    try:
        group_name = body['groupName']
        coach_id = body['coachId']
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        # Grab the workout title name from rds
        title = fetch_one("""
            SELECT title FROM group_workouts
            WHERE groupId = (SELECT id FROM groups WHERE name = %s AND coachId = %s)
            AND date = %s
        """, (group_name, coach_id, date))

        #Grab the workout, default ot empty string if not found
        if not title:
            return workout_not_found
        
        workout = get_item("Workouts", {
            "coach_id": coach_id,
            "title": title[0],
        })

        if workout:
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': 'http://localhost:8081',
                    'Access-Control-Allow-Credentials': True,
                    "Content-Type": "application/json"
                },
                'body': json.dumps(workout, cls=DecimalEncoder)
            }
        else:
            return workout_not_found
    except Exception as e:
        print(f"Error retrieving workout: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': 'http://localhost:8081',
                'Access-Control-Allow-Credentials': True,
                "Content-Type": "application/json"
            },
            'body': json.dumps({"message": "Internal server error", "error": str(e)}),
        }