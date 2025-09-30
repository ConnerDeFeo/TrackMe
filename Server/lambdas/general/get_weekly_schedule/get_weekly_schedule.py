import json
from rds import fetch_all
from user_auth import get_user_info
from datetime import datetime, timedelta, timezone

def get_weekly_schedule(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        start_date = query_params['startDate']
        group_id = query_params['groupId']
        end_date = (datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=7)).strftime("%Y-%m-%d")

        # Fetch workouts within the 7-day window for the group
        workouts = fetch_all("""
            SELECT w.title, w.description, w.sections, gw.date
            FROM workouts w
            JOIN group_workouts gw ON w.id = gw.workoutId
            JOIN groups g ON gw.groupId = g.id
            JOIN coaches c ON g.coachId = c.userId
            LEFT JOIN athlete_groups ag ON g.id = ag.groupId AND ag.athleteId = %s
            WHERE g.id = %s
                AND (c.userId = %s OR (ag.athleteId = %s AND ag.removed = FALSE))
                AND gw.date >= %s
                AND gw.date < %s
        """, (user_id, group_id, user_id, user_id, start_date, end_date))
        # Organize workouts by date
        if workouts:
            parsed_workouts = {}
            for title, description, sections, date in workouts:
                if date not in parsed_workouts:
                    parsed_workouts[date] = []
                parsed_workouts[date].append({
                    "title": title,
                    "description": description,
                    "sections": sections
                })
            print(f"Retrieved workouts: {parsed_workouts}")
            return {
                "statusCode": 200,
                "body": json.dumps(parsed_workouts)
            }
        return {
            "statusCode": 200,
            "body": json.dumps({})
        }

    except Exception as e:
        print(f"Error retrieving weekly schedule: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }