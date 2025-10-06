from rds import fetch_all
import json
from user_auth import get_user_info, get_auth_header

#Get all athletes not already part of a given group
def get_absent_group_athletes(event, context):
    query_params = event['queryStringParameters']
    auth_header = get_auth_header()

    try:
        user_info = get_user_info(event)
        coach_id = user_info["userId"]
        group_id = query_params['groupId']

        # Get absent athletes
        absent_athletes = fetch_all(
        """
            SELECT u.userId, u.username
            FROM users u
            JOIN user_relations ur
                ON u.userId = ur.userId
                AND ur.relationId = %s
            JOIN user_relations ur2
                ON ur2.userId = ur.relationId
                AND ur2.relationId = ur.userId
            LEFT JOIN athlete_groups ag 
                ON u.userId = ag.athleteId
                AND ag.groupId = %s
            WHERE (ag.athleteId IS NULL OR ag.removed = TRUE) 
            AND u.accountType = 'Athlete'
        """, (coach_id, group_id))

        if absent_athletes:
            return {
                "statusCode": 200,
                "body": json.dumps(absent_athletes),
                "headers": auth_header
            }
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "No absent athletes found"}),
            "headers": auth_header
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": auth_header
        }
