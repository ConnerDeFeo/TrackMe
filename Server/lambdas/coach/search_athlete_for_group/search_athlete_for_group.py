import json
from rds import fetch_all

#Search athletes based on a search term
def search_athlete_for_group(event, context):
    query_params = event.get('queryStringParameters', {})
    try:
        search_term = query_params['searchTerm']
        group_id = query_params['groupId']

        search_query = """
            SELECT a.username, a.userId,
                CASE 
                    WHEN ag.athleteId IS NOT NULL THEN 'Joined'
                    WHEN agi.athleteId IS NOT NULL THEN 'Invited'
                    ELSE 'Not Invited'
                END as invitation_status
            FROM athletes a
            LEFT JOIN athlete_groups ag ON a.userId = ag.athleteId AND ag.groupId = %s
            LEFT JOIN athlete_group_invites agi ON a.userId = agi.athleteId AND agi.groupId = %s
        """

        # If search term is empty, return 20 random athletes
        if search_term == "": 
            users = fetch_all(f"""
                {search_query}
                ORDER BY RANDOM()
                LIMIT 20;
            """, (group_id,group_id,))
        # If search term is provided, search athletes by username    
        else:
            users = fetch_all(f"""
                {search_query}
                WHERE to_tsvector('english', a.username) @@ to_tsquery(%s)
                LIMIT 20;
            """, (group_id,group_id, search_term))

        # If users are found, return them
        if users:
            return {
                'statusCode': 200,
                'body': json.dumps(users)
            }
        return {
            'statusCode': 404,
            'body': json.dumps({'message': 'No athletes found'})
        }
    except Exception as e:
        print(f"Error searching athletes: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }