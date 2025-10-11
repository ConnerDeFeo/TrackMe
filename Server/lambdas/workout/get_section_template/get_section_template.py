import json
from user_auth import get_auth_header, get_user_info
from rds import fetch_one

def get_section_template(event, context):
    queryStringParameters = event.get('queryStringParameters', {})
    auth_header = get_auth_header()
    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        section_template_id = queryStringParameters['sectionTemplateId']

        section_template = fetch_one("SELECT section FROM section_templates WHERE id = %s AND coachId = %s", (section_template_id, user_id))
        if section_template is None:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Section template not found'})
            }

        section_template_data = {
            'id': section_template[0],
            'name': section_template[1],
            'section': section_template[2]
        }

        return {
            'statusCode': 200,
            'body': json.dumps(section_template_data),
            'headers': auth_header
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': auth_header
        }