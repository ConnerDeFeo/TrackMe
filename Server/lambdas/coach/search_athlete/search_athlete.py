import json
from rds import fetch_all

#Search athletes based on a search term
def search_athlete(event, context):
    body = json.loads(event['body'])

    try:
        search_term = body['searchTerm']
        if search_term == "": # If search term is empty, return 20 random athletes
            users = fetch_all("""
                SELECT * FROM athletes
                ORDER BY RANDOM()
                LIMIT 20;
            """)
        else: # If search term is provided, search athletes by username
            users = fetch_all("""
                SELECT * FROM athletes
                WHERE to_tsvector('english', username) @@ to_tsquery(%s)
                LIMIT 20;
            """, (search_term,))  
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