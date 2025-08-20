import json
from rds import execute_commit, fetch_one

#Adds an athlete to a group
def add_athlete_to_group(event, context):
    body = json.loads(event.get('body', '{}'))

    try:
        athlete_id = body['athleteId']
        coach_id = body['coachId']
        group_id = body['groupId']

        #Check to see if coach has athlete added
        connection_active = fetch_one(
        """
            SELECT * FROM athlete_coaches
            WHERE athleteId = %s AND coachId = %s
        """, (athlete_id, coach_id))
        if connection_active:
            # Check if they were previously a part of the group
            previous_group = fetch_one(
            """
                SELECT * FROM athlete_groups
                WHERE athleteId = %s AND groupId = %s AND removed = TRUE
            """, (athlete_id, group_id))
            if previous_group:
                execute_commit(
                """
                    UPDATE athlete_groups
                    SET removed = FALSE
                    WHERE athleteId = %s AND groupId = %s
                """, (athlete_id, group_id))
            else:
                execute_commit(
                """
                    INSERT INTO athlete_groups (athleteId, groupId)
                    VALUES (%s, %s)
                """, (athlete_id, group_id))
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Athlete added to group successfully'})
            }

        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Athlete is not associated with this coach'})
        }

    except Exception as e:
        print(f"Error parsing request body: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'})
        }
