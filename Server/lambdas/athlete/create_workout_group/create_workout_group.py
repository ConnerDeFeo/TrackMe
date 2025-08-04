import json
from datetime import datetime, timezone
from rds import execute_commit_fetch_one, execute_commit_many

def create_workout_group(event,context):
    body = json.loads(event['body'])

    try:
        leaderId = body['leaderId']
        other_athletes = body['other athletes']
        workout_title = body['workoutTitle']
        coach_username = body['coachUsername']
        workout_group_name = body['workoutGroupName']
        group_name = body['groupName']
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        #Create a workout group 
        workout_group_id = execute_commit_fetch_one("""
            WITH workout_info AS (
                SELECT gw.id as workout_id
                FROM group_workouts gw
                JOIN groups g ON gw.groupId = g.id
                JOIN coaches c ON g.coachId = c.userId
                WHERE gw.title = %s 
                AND gw.date = %s 
                AND g.name = %s 
                AND c.username = %s
            )
            INSERT INTO workout_groups (leaderId, workoutId, workoutGroupName)
            VALUES (%s, (SELECT workout_id FROM workout_info),  %s)
            RETURNING id
        """, (workout_title, date, group_name, coach_username, leaderId, workout_group_name))

        if not workout_group_id:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'message': 'Workout group creation failed'
                })
            }
        
        #Insert other athletes into the group
        params = []
        for athlete in other_athletes:
            params.append((athlete, workout_group_id))

        execute_commit_many("""
            INSERT INTO workout_group_members (athleteUsername, workoutGroupId)
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
