def create_athlete(event, context):
    first_name = event['first_name']
    last_name = event['last_name']
    email = event['email']
    password = event['password']
    username = event['username']
    return {
        "statusCode": 200,
        "body": f"Athlete {first_name}, {last_name}, {email}, {username}, {password}, created successfully"
    }