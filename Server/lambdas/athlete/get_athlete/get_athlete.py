import json
from rds import fetch_one


def get_athlete(event, context):
    # Get userId from path parameters
    userId = event['pathParameters']['userId']
    
    try:
        # Get athlete from RDS
        response = fetch_one("SELECT * FROM athletes WHERE userId = %s", (userId,))
        
        # Check if athlete exists
        if response:
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "http://localhost:8081",
                    "Access-Control-Allow-Credentials": True,
                    "Content-Type": "application/json"
                },
                "body": json.dumps(response)
            }
        else:
            return {
                "statusCode": 404,
                "headers": {
                    "Access-Control-Allow-Origin": "http://localhost:8081",
                    "Access-Control-Allow-Credentials": True,
                    "Content-Type": "application/json"
                },
                "body": json.dumps({"message": "Athlete not found"})
            }
    
    except Exception as e:
        print(f"Error retrieving athlete: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:8081",
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Internal server error", "error": str(e)})
        } 