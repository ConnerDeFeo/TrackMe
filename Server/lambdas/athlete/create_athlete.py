import json
from rds import execute_commit


#Create athlete
def create_athlete(event, context):
    body = json.loads(event['body']) 

    # Attempt athlete creation
    try:
        #Insert athlete into the database
        execute_commit('INSERT INTO athletes (userId, username) VALUES (%s, %s)', (body['userId'], body['username']))
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:8081", 
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Athlete created successfully"})
        }

    # If athlete already exists, return error
    except Exception as e:
        print(f"Error creating athlete: {str(e)}")
        return {
            "statusCode": 409,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:8081",  
                "Access-Control-Allow-Credentials": True,
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Athlete already exists"})
        }