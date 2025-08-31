from datetime import datetime, timezone
from rds import fetch_all
import json

#Check all assigned workouts for a given date, group, and athlete
def view_workouts_athlete(event, context):
    query_params = event.get('queryStringParameters', {})
    
    try:
        group_id = query_params['groupId']
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        workouts = fetch_all(
            """
                SELECT w.id, w.title, w.description, w.exercises FROM workouts w
                JOIN group_workouts gw ON gw.workoutId = w.id
                JOIN groups g ON g.id = gw.groupId
                WHERE g.id = %s
                AND gw.date = %s
            """, (group_id, date))

        if workouts:
            converted_workouts = []
            for workout in workouts:
                converted_workouts.append({
                    'id': workout[0],
                    'title': workout[1],
                    'description': workout[2],
                    'exercises': workout[3]
                })
            return {
                'statusCode': 200,
                'body': json.dumps(converted_workouts)
            }
        return {
                'statusCode': 404,
                'body': json.dumps({"message": "Workout not found"})
            }
    except Exception as e:
        print(f"Error retrieving workout: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({"message": "Internal server error", "error": str(e)})
        }