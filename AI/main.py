from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime
from uuid import UUID, uuid4
from AI.model import get_gemini_prediction

app = FastAPI()


# Input format from your backend
class SensorRecord(BaseModel):
    temperature: float
    humidity: float
    air_quality: float
    timestamp: datetime


class PredictionRequest(BaseModel):
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


@app.post("/predict", response_model=PredictionResponse)
async def predict_endpoint(request: PredictionRequest):
    # Pass the whole list of records to the AI
    prediction_data = get_gemini_prediction(request.device_id, request.records)

    # Return as a structured response
    return PredictionResponse(
        id=uuid4(),
        device_id=request.device_id,
        generated_at=datetime.now(),
        **prediction_data  # Unpacks the dictionary from Gemini
    )


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
