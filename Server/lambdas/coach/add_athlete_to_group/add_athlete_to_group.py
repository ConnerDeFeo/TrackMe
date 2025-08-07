import json
from rds import execute_commit, fetch_one

#Adds an athlete to a group for workouts
def add_athlete_to_group(event, context):
    body = json.loads(event.get('body', '{}'))

    try:
        athlete_id = body['athleteId']
        coach_id = body['coachId']
        group_id = body['groupId']

        #Check to see if coach has athlete added
        existing_invite = fetch_one(
        """
            SELECT * FROM athlete_coaches
            WHERE athleteId = %s AND coachId = %s
        """, (athlete_id, coach_id))
        if existing_invite:
            # Insert the athlete into the group
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
