import json
from datetime import datetime, timezone
from rds import execute_commit_fetch_one, execute_commit_many

def create_workout_group(event,context):
    body = json.loads(event['body'])

    try:
        leaderId = body['leaderId']
        athleteIds = body['athleteIds']
        group_id = body['groupId']
        workout_group_name = body['workoutGroupName']
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        #Create a workout group 
        workout_group_id = execute_commit_fetch_one("""
            INSERT INTO workout_groups (leaderId, groupId, workoutGroupName, date)
            VALUES (%s, %s,  %s, %s)
            RETURNING id
        """, (leaderId, group_id, workout_group_name, date))

        if not workout_group_id:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'message': 'Workout group creation failed'
                })
            }

        #Insert all athletes into the group
        params = []
        for id in athleteIds:
            params.append((id, workout_group_id))

        execute_commit_many("""
            INSERT INTO workout_group_members (athleteId, workoutGroupId)
            VALUES (%s, %s)
        """, params)
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Workout group created successfully'
            })
        }

    except Exception as e:
        print(f"Error creating workout group: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({"message": "Internal server error", "error": str(e)})
        }
