import json
from rds import fetch_one, fetch_all
from datetime import datetime, timezone

#Gets all workout groups for a given leader on a given date
#Returns {groupId: [workout group members, groupname]}
def get_workout_groups(event, context):
    body = json.loads(event['body'])

    try:
        leader_id = body['leaderId']
        date = body.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        #Fetch all workout groups for the given leader
        workout_groups = fetch_all(
            """
                SELECT g.id, a.username, wg.workoutGroupName
                FROM workout_groups wg
                JOIN workout_group_members wgm ON wg.id = wgm.workoutGroupId
                JOIN athletes a ON wgm.athleteId = a.userId
                JOIN groups g ON wg.groupId = g.id
                WHERE wg.leaderId = %s AND wg.date = %s
            """,
        (leader_id, date))

        #Convert to more parsable input
        if workout_groups:
            parsed_groups = {}
            for group in workout_groups:
                group_id = group[0]
                if group_id not in parsed_groups:
                    parsed_groups[group_id] = {
                        "members": [],
                        "workoutGroupName": group[2]
                    }
                parsed_groups[group_id]["members"].append(group[1])

            return {
                "statusCode": 200,
                "body": json.dumps(parsed_groups)
            }
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "No workout groups found"})
        }

    except Exception as e:
        print(f"Error fetching workout groups: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }