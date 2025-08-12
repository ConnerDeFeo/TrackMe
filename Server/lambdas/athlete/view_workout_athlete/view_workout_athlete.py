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
        group_id = body['groupId']
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        # Grab the workout workoutId name from rds
        ids = fetch_one(
        """
            SELECT workoutId, c.userId FROM group_workouts gw
            JOIN groups g ON g.id = gw.groupId
            JOIN coaches c ON c.userId = g.coachId
            WHERE groupId = %s
            AND date = %s
        """, (group_id, date))

        #Grab the workout, default ot empty string if not found
        if not ids:
            return workout_not_found
        
        workout = get_item("Workouts", {
            "coach_id": ids[1],
            "workout_id": ids[0],
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