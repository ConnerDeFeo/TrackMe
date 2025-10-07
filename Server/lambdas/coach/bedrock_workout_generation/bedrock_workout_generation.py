import json
import boto3
from user_auth import get_user_info, post_auth_header
from rds import fetch_one


def bedrock_workout_generation(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:
        user_prompt = body.get('userPrompt', '')
        user_info = get_user_info(event)
        user_id = user_info['userId']

        # Check to make sure user is valid
        user = fetch_one("SELECT userId FROM users WHERE userId = %s", (user_id,))
        if not user:
            return {
                'statusCode': 401,
                'body': json.dumps({'error': 'Unauthorized'}),
                'headers': auth_header
            }
        print("user valid!")
        prompt = f"""
            You are a workout generator. Create a running workout based on this request: {user_prompt}

            Return ONLY a JSON object. Do NOT use markdown, code blocks, or any formatting.

            The JSON should follow this structure:
            {{
            "title": "string",
            "description": "string",
            "sections": [
                {{
                "name": "string",
                "minSets": int,
                "maxSets": int,  (optional)
                "exercises": [
                    {{
                    "type": "run" | "rest" | "strength",
                    "measurement": "meters" (only if type == "run"),
                    "distance": int (only if type == "run"),
                    "description": "string" (only if type == "strength"),
                    "minReps": int,
                    "maxReps": int
                    }}
                ]
                }}
            ]
            }}

            Rules:
            - type "run": must have measurement="meters", distance (int), minReps (int)
            - type "rest": must have only minReps (seconds, can be decimal like 90.5)
            - type "strength": must have description (string) and minReps (int)
            - maxSets and maxReps are optional (only use for ranges like minReps: 3, maxReps: 5)
            - Start your response with {{ and end with }}. No other text.
        """
        print("Attempting bedrock connection!")
        bedrock = boto3.client("bedrock-runtime", region_name="us-east-2")

        print("Connected to bedrock, invoking model...")

        response = bedrock.converse(
            modelId = "us.amazon.nova-lite-v1:0",
            messages=[
                {
                    "role": "user", 
                    "content": [{"text": prompt}]
                }
            ],
            inferenceConfig={"maxTokens": 1000, "temperature": 0.3, "topP": 0.9}
        )

        print("Model invoked, processing response...")
        raw_text = response["output"]["message"]["content"][0]["text"]
        print(f"Raw model output: {raw_text}")
        # Attempt to parse JSON safely
        try:
            workout_json = json.loads(raw_text)
        except json.JSONDecodeError:
            # Fallback: wrap raw text so front-end sees error
            workout_json = {"error": "Invalid JSON returned from model", "raw": raw_text}

        # Return JSON directly to frontend
        return {
            'statusCode': 200,
            'body': json.dumps(workout_json),
            'headers': auth_header
        }

    except Exception as e:
        print(f"Error generating workout: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': auth_header
        }