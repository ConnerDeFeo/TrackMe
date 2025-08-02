import json
from rds import fetch_all


def search_athlete(event, context):
    body = json.loads(event['body'])

    try:
        search_term = body['searchTerm']
        if search_term == "":
            users = fetch_all("""
                SELECT * FROM athletes
                ORDER BY RANDOM()
                LIMIT 20;
            """)
        else:
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