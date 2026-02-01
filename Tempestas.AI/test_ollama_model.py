import os
import json
import ollama  # Make sure to 'pip install ollama'
from datetime import datetime, timedelta


def get_ollama_prediction(device_id, records):
    # Perfect: Converts Pydantic records to a list of dicts
    formatted_data = [r.model_dump() for r in records]

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

    # Added a specific target for the AI to predict (1 hour from now)
    target_time = (datetime.now() + timedelta(hours=1)).isoformat()

    prompt = (
        f"Analyze these sensor records for device {device_id}: {json.dumps(formatted_data, default=str)}. "
        f"Predict the values for the next hour. Current time is {datetime.now().isoformat()}. "
        f"The 'predicted_for' field must be a timestamp for one hour from now: {target_time}."
    )

    # 4. Call Ollama
    response = ollama.chat(
        model="phi4-mini",  # Corrected: Removed the trailing colon
        messages=[{"role": "user", "content": prompt}],
        format=prediction_schema,
        options={"temperature": 0},
    )

    # 5. Corrected access: response.message.content
    return json.loads(response.message.content)
