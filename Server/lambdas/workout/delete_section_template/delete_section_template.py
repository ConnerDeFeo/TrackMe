import json
from user_auth import get_user_info, delete_auth_header
from rds import execute_commit

def delete_section_template(event, context):
    qeuryStringParameters = event.get('queryStringParameters', {})
    auth_header = delete_auth_header()
    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        section_template_id = qeuryStringParameters['sectionTemplateId']

        execute_commit("DELETE FROM section_templates WHERE id = %s AND coachId = %s", (section_template_id, user_id))

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Section template deleted successfully'}),
            'headers': auth_header
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': auth_header
        }