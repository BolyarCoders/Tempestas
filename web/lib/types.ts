export interface MeasurementResponse {
  id: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  airQuality: number;
  measuredAt: string;
}

export interface PredictionResponse {
  id: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  airQuality: number;
  predictedFor: string;
  generatedAt: string;
  confidence: number;
}
