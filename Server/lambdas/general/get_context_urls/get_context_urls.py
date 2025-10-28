from rds import execute_fetch_all
from user_auth import get_user_info, get_auth_header
from datetime import datetime, timedelta
import json

# fetches all the relevant coaching document URLS for a given coach for a given date and 7 days prior
def get_context_urls(event, context):
    query_params = event.get('queryStringParameters', {}) or {}
    auth_header = get_auth_header()

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        start_date = query_params['startDate']
        end_date = (datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=7)).strftime("%Y-%m-%d")

        # fetch from db
        context_urls = execute_fetch_all(
        """
            SELECT contextUrl, date
            FROM context_urls cu
            JOIN user_relations ur1 ON cu.coachId = ur1.userId
            JOIN user_relations ur2 ON ur1.relationId = ur2.userId
            WHERE ur2.userId = %s AND cu.date >= %s AND cu.date < %s
            ORDER BY date DESC
        """, (user_id, start_date, end_date)) or []

        return {
            'statusCode': 200,
            'body': json.dumps(context_urls),
            'headers': auth_header
        }
    
    except Exception as e:
        print(f"Error getting context URLs: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to get context URLs'}),
            'headers': auth_header
        }