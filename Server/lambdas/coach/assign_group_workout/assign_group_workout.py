from datetime import datetime, timezone
import json 
from rds import execute_commit, execute_commit_fetch_one
from user_auth import get_user_info, post_auth_header

def assign_group_workout(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:
        user_info = get_user_info(event)
        coach_id = user_info["userId"]
        group_id = body['groupId']
        title = body.get('title', '')
        description = body.get('description', '')
        sections = body.get('sections', [])
        group_workout_id = body.get('groupWorkoutId')
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        jsonSections = json.dumps(sections)
        
        if group_workout_id:
            # If workoutId is provided, update the existing workout
            updated = execute_commit_fetch_one(
                """
                    UPDATE workouts
                    SET title = %s, description = %s, sections = %s
                    WHERE id = (SELECT workoutId FROM group_workouts WHERE id = %s) AND coachId = %s AND isTemplate = %s
                    RETURNING id
                """,
                (title, description, jsonSections, group_workout_id, coach_id, False)
            )
            # Only return for updating non workout template
            if updated:
                return {
                    'statusCode': 200,
                    'body': json.dumps({'message': 'Workout updated successfully', 'groupWorkoutId': group_workout_id})
                }
        # Create a new workout and fetch the id
        workout_id = execute_commit_fetch_one(
            """
                INSERT INTO workouts (coachId, title, description, sections, isTemplate)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """,
            (coach_id, title, description, jsonSections, False)
        )
        if workout_id:
            # This implies the workout is a workout template and the previous group workout needs to be updated
            if group_workout_id:
                execute_commit(
                    """
                        UPDATE group_workouts
                        SET workoutId = %s
                        WHERE id = %s
                    """,
                    (workout_id[0], group_workout_id)
                )
                return {
                    'statusCode': 200,
                    'body': json.dumps({'message': 'Workout updated successfully', 'groupWorkoutId': group_workout_id}),
                    'headers': auth_header
                }

            # Else linkl the new workout to the group
            execute_commit(
                """
                    INSERT INTO group_workouts (groupId, workoutId, date)
                    VALUES (%s, %s, %s)
                """,
                (group_id, workout_id[0], date)
            )
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Workout assigned to group successfully', 'workout_id': workout_id[0]}),
                'headers': auth_header
            }
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Failed to assign workout to group'}),
            'headers': auth_header
        }
    except Exception as e:
        print(f"Error assigning workout to group: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': auth_header
        }