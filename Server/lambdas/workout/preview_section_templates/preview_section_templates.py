import json
from user_auth import get_auth_header, get_user_info
from rds import fetch_all

# Returns the names and ids of all section templates for the authenticated coach
def preview_section_templates(event, context):
    auth_header = get_auth_header()
    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']

        # Fetch section templates for the coach
        section_templates = fetch_all("SELECT id, name FROM section_templates WHERE coachId = %s", (user_id,))
        if section_templates is None:
            section_templates = []

        # Parse the results into a list of dictionaries
        parsed_templates = [{'id': row[0], 'name': row[1]} for row in section_templates]
        return {
            'statusCode': 200,
            'body': json.dumps(parsed_templates),
            'headers': auth_header
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)}),
            'headers': auth_header
        }