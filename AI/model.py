import os
import json
import google.generativeai as genai
from datetime import datetime, timedelta

genai.configure(api_key=os.getenv("GEMINI_KEY"))


def get_gemini_prediction(device_id, records):
    # Convert records list to a string Gemini can read
    formatted_data = [r.model_dump() for r in records]

    # Define the exact JSON structure Gemini must follow
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

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",  # Use 1.5-flash for reliable JSON
        generation_config={
            "response_mime_type": "application/json",
            "response_schema": prediction_schema,
        },
    )

    prompt = (
        f"Analyze these 60 sensor records for device {device_id}: {json.dumps(formatted_data, default=str)}. "
        f"Predict the values for the next hour. Current time is {datetime.now()}."
    )

    response = model.generate_content(prompt)

    # Parse the string output into a Python dictionary
    return json.loads(response.text)
