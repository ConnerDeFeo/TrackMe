import json
from rds import fetch_all

#Searches coaches based on search term
def search_coaches(event, context):
    query_params = event.get('queryStringParameters', {})
    try:
        search_term = query_params.get('searchTerm', "")
        athlete_id = query_params['athleteId']

        search_query = """
            SELECT c.username, c.userId,
                CASE 
                    WHEN ac.coachId IS NOT NULL THEN 'Added'
                    WHEN aci.athleteId IS NOT NULL THEN 'Invited'
                    WHEN acr.coachId IS NOT NULL THEN 'Pending'
                    ELSE 'Not Added'
                END as invitation_status
            FROM coaches c
            LEFT JOIN athlete_coaches ac ON c.userId = ac.coachId AND ac.athleteId = %s
            LEFT JOIN athlete_coach_requests acr ON c.userId = acr.coachId AND acr.athleteId = %s
            LEFT JOIN athlete_coach_invites aci ON c.userId = aci.coachId
        """

        # If search term is empty, return 10 random coaches
        if search_term == "": 
            users = fetch_all(f"""
                {search_query}
                ORDER BY RANDOM()
                LIMIT 10;
            """, (athlete_id,athlete_id,))
        # If search term is provided, search athletes by username    
        else:
            formatted_search_term = f"{search_term}:* | *{search_term}" #Formatting for full-text search
            users = fetch_all(f"""
                {search_query}
                WHERE to_tsvector('english', c.username) @@ to_tsquery(%s)
                LIMIT 20;
            """, (athlete_id, athlete_id, formatted_search_term))

        # If users are found, return them
        if users:
            return {
                "statusCode": 200,
                "body": json.dumps(users)
            }
        else:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "No users found"})
            }
    except Exception as e:
        print("Error fetching athletes:", e)
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }