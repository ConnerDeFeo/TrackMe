import json
from rds import fetch_all

#Gets a group and all related athletes for a coach
def get_group(event, context):
    body = json.loads(event['body'])
    userId = body['userId']
    groupName = body['groupName']

    try:
        group_data = fetch_all(
            """
            SELECT a.username FROM groups g
            LEFT JOIN athlete_groups ag ON g.id = ag.groupId
            LEFT JOIN athletes a ON ag.athleteId = a.userId
            WHERE g.coachId = %s AND g.name = %s
            AND a.username IS NOT NULL
            """,
            (userId, groupName)
        )

        if group_data:
            return {
                "statusCode": 200,
                "body": json.dumps(group_data)
            }
        else:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Group not found"})
            }
    except Exception as e:
        print(f"Error retrieving group: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }