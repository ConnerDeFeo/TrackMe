import json
from user_auth import get_user_info
from rds import fetch_all

def search_user_relation(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        search_term = query_params.get('searchTerm', '')

        # Search user_relations, if no relation from user --> other, not added
        # If user --> other one way, pending
        # if other --> user one way, awaiting acceptance
        # if both ways, added
        search_query = """
            SELECT u.userId, u.username, u.firstName, u.lastName, u.accountType,
                CASE
                    WHEN ur1.userId IS NOT NULL AND ur2.userId IS NOT NULL THEN 'added'
                    WHEN ur1.userId IS NOT NULL AND ur2.userId IS NULL THEN 'pending'
                    WHEN ur1.userId IS NULL AND ur2.userId IS NOT NULL THEN 'awaiting response'
                    ELSE 'not added'
                END AS relation_status
            FROM users u
            LEFT JOIN user_relations ur1 
                ON ur1.relationId = u.userId
                AND ur1.userId = %s
            LEFT JOIN user_relations ur2
                ON u.userId = ur2.userId
                AND ur2.relationId = %s
            WHERE u.userId != %s
        """
        params = [user_id, user_id, user_id]
        if search_term:
            search_query = f"""
                {search_query} 
                AND u.username ILIKE %s
            """
            params.append(f"%{search_term}%")
        else:
            search_query = f"""
                {search_query}
                ORDER BY RANDOM()
            """
        results = fetch_all(
            f"{search_query} LIMIT 20",
            params
        )

        return {
            'statusCode': 200,
            'body': json.dumps(results)
        }
    except Exception as e:
        print(f"Error retrieving user info: {e}")
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized', 'message': str(e)})
        }