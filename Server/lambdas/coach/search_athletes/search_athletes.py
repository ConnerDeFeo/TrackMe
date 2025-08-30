import json
from rds import fetch_all

#Searches athletes based on search term
def search_athletes(event, context):
    query_params = event.get('queryStringParameters', {})
    try:
        search_term = query_params.get('searchTerm', "")
        coach_id = query_params['coachId']

        search_query = """
            SELECT a.username, a.userId,
                CASE 
                    WHEN ac.athleteId IS NOT NULL THEN 'Added'
                    WHEN acr.athleteId IS NOT NULL THEN 'Requested'
                    WHEN aci.athleteId IS NOT NULL THEN 'Pending'
                    ELSE 'Not Added'
                END as invitation_status
            FROM athletes a
            LEFT JOIN athlete_coaches ac ON a.userId = ac.athleteId AND ac.coachId = %s
            LEFT JOIN athlete_coach_invites aci ON a.userId = aci.athleteId AND aci.coachId = %s
            LEFT JOIN athlete_coach_requests acr ON a.userId = acr.athleteId
        """

        # If search term is empty, return 20 random athletes
        if search_term == "": 
            users = fetch_all(f"""
                {search_query}
                ORDER BY RANDOM()
                LIMIT 20;
            """, (coach_id,coach_id,))
        # If search term is provided, search athletes by username    
        else:
            formatted_search_term = f"{search_term}:* | *{search_term}" #Formatting for full-text search
            users = fetch_all(f"""
                {search_query}
                WHERE to_tsvector('english', a.username) @@ to_tsquery(%s)
                LIMIT 20;
            """, (coach_id,coach_id, formatted_search_term))

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