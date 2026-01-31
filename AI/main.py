import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime
from uuid import UUID, uuid4
from fastapi.middleware.cors import CORSMiddleware

# from model import get_gemini_prediction,
from test_ollama_model import get_ollama_prediction

app = FastAPI()


# Input format from your backend
class SensorRecord(BaseModel):
    temperature: float
    humidity: float
    air_quality: float
    timestamp: datetime


class PredictionRequest(BaseModel):
    device_id: UUID
    records: List[SensorRecord]


# Output format mirroring your C# class
class PredictionResponse(BaseModel):
    id: UUID
    device_id: UUID
    temperature: float
    humidity: float
    air_quality: float
    predicted_for: datetime
    generated_at: datetime
    confidence: float


# @app.post("/predict", response_model=PredictionResponse)
# async def predict_endpoint(request: PredictionRequest):
#     # Pass the whole list of records to the AI
#     prediction_data = get_gemini_prediction(request.device_id, request.records)

#     # Return as a structured response
#     return PredictionResponse(
#         id=uuid4(),
#         device_id=request.device_id,
#         generated_at=datetime.now(),
#         **prediction_data  # Unpacks the dictionary from Gemini
# )


@app.post("/predict_ollama", response_model=PredictionResponse)
async def predict_endpoint(request: PredictionRequest):
    # If Pydantic reached here, 'request' is already a proper object.
    # The error you saw happens BEFORE this function runs.

    try:
        prediction_data = get_ollama_prediction(request.device_id, request.records)

        return PredictionResponse(
            id=uuid4(),
            device_id=request.device_id,
            generated_at=datetime.now(),
            **prediction_data
        )
    except Exception as e:
        # This catches errors inside the AI logic
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

"""
public class Prediction
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Required]
    [Column("device_id")]
    public Guid DeviceId { get; set; }

    [ForeignKey(nameof(DeviceId))]
    public Device Device { get; set; } = null!;

    [Column("temperature")]
    public double Temperature { get; set; }

    [Column("humidity")]
    public double Humidity { get; set; }

    [Column("air_quality")]
    public double AirQuality { get; set; }

    [Column("predicted_for", TypeName = "timestamptz")]
    public DateTimeOffset PredictedFor { get; set; }

    [Column("generated_at", TypeName = "timestamptz")]
    public DateTimeOffset GeneratedAt { get; set; }

    [Column("confidence")]
    public double Confidence { get; set; }
}
"""
