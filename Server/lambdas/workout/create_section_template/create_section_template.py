import json
from user_auth import post_auth_header, get_user_info
from rds import execute_commit

def create_section_template(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        accountType = user_info['accountType']
        section = body['section']

        name = section['name']
        minSets = section['minSets']
        maxSets = section.get('maxSets', None)
        exercises = section.get('exercises', [])
        sectionId = section.get('id', None)  # For updates

        if sectionId:
            # Update existing section template
            execute_commit(
                """
                    UPDATE section_templates
                    SET name = %s, minSets = %s, maxSets = %s, exercises = %s
                    WHERE id = %s AND coachId = %s
                """,
                (name, minSets, maxSets, json.dumps(exercises), sectionId, user_id)
            )
            return {
                "statusCode": 200,
                "body": json.dumps({"message": "Section template updated successfully"}),
                'headers': auth_header
            }

        if accountType != 'Coach':
            return {
                "statusCode": 403,
                "body": json.dumps({"message": "Forbidden: Only coaches can create section templates"})
            }

        # insert section template into the database
        execute_commit(
            """
                INSERT INTO section_templates (coachId, name, minSets, maxSets, exercises)
                VALUES (%s, %s, %s, %s, %s)
            """,
            (user_id, name, minSets, maxSets, json.dumps(exercises))
        )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Section template created successfully"}),
            'headers': auth_header
        }

    except Exception as e:
        print(f"Error creating section template: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
            'headers': auth_header
        }