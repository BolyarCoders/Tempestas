import os
import json
import google.generativeai as genai  # Correct import
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_KEY"))


def get_gemini_prediction(device_id, records):
    # 1. Convert Pydantic records to a list of dicts
    formatted_data = [r.model_dump() for r in records]

    # 2. Define the exact JSON structure for Gemini
    prediction_schema = {
        "type": "object",
        "properties": {
            "temperature": {"type": "number"},
            "humidity": {"type": "number"},
            "air_quality": {"type": "number"},
            "predicted_for": {"type": "string"},
            "confidence": {"type": "number"},
        },
        "required": [
            "temperature",
            "humidity",
            "air_quality",
            "predicted_for",
            "confidence",
        ],
    }

    # 3. Use the correct model and config
    # Note: Use gemini-1.5-flash for production speed
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        generation_config={
            "response_mime_type": "application/json",
            "response_schema": prediction_schema,
        },
    )

    # 4. Calculate the 'target' time so Gemini knows what to put in 'predicted_for'
    target_time = (datetime.now() + timedelta(hours=1)).isoformat()

    prompt = (
        f"You are an expert data scientist. Analyze these sensor records for device {device_id}: "
        f"{json.dumps(formatted_data, default=str)}. "
        f"Predict the values for exactly one hour from now. Current time is {datetime.now().isoformat()}. "
        f"The 'predicted_for' field must be exactly: {target_time}."
    )

    # 5. Generate content
    response = model.generate_content(prompt)

    # 6. Parse and return
    try:
        return json.loads(response.text)
    except Exception as e:
        print(f"Error parsing Gemini response: {response.text}")
        raise e
