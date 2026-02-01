import { useCallback, useState } from "react";

const BASE_URL = "https://tempestas-16da.onrender.com";

interface Prediction {
  id: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  airQuality: number;
  predictedFor: string;
  generatedAt: string;
  confidence: number;
}

interface ApiError {
  error: string;
}

interface UseDevicePredictionsReturn {
  getPrediction: (predictionId: string) => Promise<Prediction>;
  getPredictionByDeviceId: (deviceId: string) => Promise<Prediction>;
  prediction: Prediction | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  clearPrediction: () => void;
}

export const useDevicePredictions = (): UseDevicePredictionsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearPrediction = useCallback(() => {
    setPrediction(null);
  }, []);

  const getPrediction = useCallback(
    async (predictionId: string): Promise<Prediction> => {
      setLoading(true);
      setError(null);

      try {
        if (!predictionId || predictionId.trim() === "") {
          throw new Error("PredictionId cannot be null or empty");
        }

        console.log("📤 Request to get prediction:", predictionId);

        const response = await fetch(
          `${BASE_URL}/api/prediction/${predictionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        console.log(
          "📥 Response status:",
          response.status,
          response.statusText,
        );

        if (!response.ok) {
          // Try to parse error response
          let errorMessage = "Failed to retrieve prediction";
          try {
            const errorData: ApiError = await response.json();
            console.log("❌ Error response:", errorData);
            errorMessage = errorData.error || errorMessage;
          } catch {
            // If JSON parsing fails, use status text
            errorMessage = response.statusText || errorMessage;
            console.log("❌ Error (no JSON):", errorMessage);
          }
          throw new Error(errorMessage);
        }

        const predictionData: Prediction = await response.json();
        console.log("✅ Success response:", predictionData);
        console.log("📊 Prediction details:", {
          temperature: `${predictionData.temperature}°C`,
          humidity: `${predictionData.humidity}%`,
          airQuality: predictionData.airQuality,
          confidence: `${(predictionData.confidence * 100).toFixed(0)}%`,
          predictedFor: new Date(predictionData.predictedFor).toLocaleString(),
          generatedAt: new Date(predictionData.generatedAt).toLocaleString(),
        });

        setPrediction(predictionData);
        return predictionData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        console.error("🔥 Exception caught:", err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getPredictionByDeviceId = useCallback(
    async (deviceId: string): Promise<Prediction> => {
      setLoading(true);
      setError(null);

      try {
        if (!deviceId || deviceId.trim() === "") {
          throw new Error("DeviceId cannot be null or empty");
        }

        console.log(
          "📤 Request to get latest prediction for device:",
          deviceId,
        );

        const response = await fetch(`${BASE_URL}/api/prediction/${deviceId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(
          "📥 Response status:",
          response.status,
          response.statusText,
        );

        if (!response.ok) {
          // Try to parse error response
          let errorMessage = "Failed to retrieve prediction";
          try {
            const errorData: ApiError = await response.json();
            console.log("❌ Error response:", errorData);
            errorMessage = errorData.error || errorMessage;
          } catch {
            // If JSON parsing fails, use status text
            errorMessage = response.statusText || errorMessage;
            console.log("❌ Error (no JSON):", errorMessage);
          }
          throw new Error(errorMessage);
        }

        const predictionData: Prediction = await response.json();
        console.log("✅ Success response:", predictionData);
        console.log("📊 Prediction details:", {
          id: predictionData.id,
          deviceId: predictionData.deviceId,
          temperature: `${predictionData.temperature}°C`,
          humidity: `${predictionData.humidity}%`,
          airQuality: predictionData.airQuality,
          confidence: `${(predictionData.confidence * 100).toFixed(0)}%`,
          predictedFor: new Date(predictionData.predictedFor).toLocaleString(),
          generatedAt: new Date(predictionData.generatedAt).toLocaleString(),
        });

        setPrediction(predictionData);
        return predictionData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        console.error("🔥 Exception caught:", err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    getPrediction,
    getPredictionByDeviceId,
    prediction,
    loading,
    error,
    clearError,
    clearPrediction,
  };
};
