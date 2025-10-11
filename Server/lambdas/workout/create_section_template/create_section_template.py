import json
from user_auth import post_auth_header, get_user_info
from rds import execute_commit

def create_section_template(event, context):
    body = json.loads(event['body'])

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        accountType = user_info['accountType']
        name = body['name']
        section = body['section']

        if accountType != 'Coach':
            return {
                "statusCode": 403,
                "body": json.dumps({"message": "Forbidden: Only coaches can create section templates"})
            }

        # insert section template into the database
        execute_commit(
            """
                INSERT INTO section_templates (coachId, section, name)
                VALUES (%s, %s, %s)
            """,
            (user_id, json.dumps(section), name)
        )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Section template created successfully"})
        }

    except Exception as e:
        print(f"Error creating section template: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"})
        }