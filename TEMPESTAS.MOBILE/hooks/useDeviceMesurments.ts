import { useCallback, useState } from "react";

const BASE_URL = "https://tempestas-16da.onrender.com";

interface Measurement {
  id: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  airQuality: number;
  measuredAt: string;
}

interface ApiError {
  error: string;
}

interface UseDeviceMeasurementsReturn {
  getMeasurement: (measurementId: string) => Promise<Measurement>;
  getMeasurementByDeviceId: (deviceId: string) => Promise<Measurement>;
  measurement: Measurement | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  clearMeasurement: () => void;
}

export const useDeviceMeasurements = (): UseDeviceMeasurementsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearMeasurement = useCallback(() => {
    setMeasurement(null);
  }, []);

  const getMeasurement = useCallback(
    async (measurementId: string): Promise<Measurement> => {
      setLoading(true);
      setError(null);

      try {
        if (!measurementId || measurementId.trim() === "") {
          throw new Error("MeasurementId cannot be null or empty");
        }

        console.log("📤 Request to get measurement:", measurementId);

        const response = await fetch(
          `${BASE_URL}/api/measurements/${measurementId}`,
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
          let errorMessage = "Failed to retrieve measurement";
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

        const measurementData: Measurement = await response.json();
        console.log("✅ Success response:", measurementData);
        console.log("📊 Measurement details:", {
          temperature: `${measurementData.temperature}°C`,
          humidity: `${measurementData.humidity}%`,
          airQuality: measurementData.airQuality,
          measuredAt: new Date(measurementData.measuredAt).toLocaleString(),
        });

        setMeasurement(measurementData);
        return measurementData;
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

  const getMeasurementByDeviceId = useCallback(
    async (deviceId: string): Promise<Measurement> => {
      setLoading(true);
      setError(null);

      try {
        if (!deviceId || deviceId.trim() === "") {
          throw new Error("DeviceId cannot be null or empty");
        }

        console.log(
          "📤 Request to get latest measurement for device:",
          deviceId,
        );

        // Using the device measurements endpoint
        const response = await fetch(
          `${BASE_URL}/api/measurements/${deviceId}`,
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
          let errorMessage = "Failed to retrieve measurement";
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

        const measurementData: Measurement = await response.json();
        console.log("✅ Success response:", measurementData);
        console.log("📊 Measurement details:", {
          id: measurementData.id,
          deviceId: measurementData.deviceId,
          temperature: `${measurementData.temperature}°C`,
          humidity: `${measurementData.humidity}%`,
          airQuality: measurementData.airQuality,
          measuredAt: new Date(measurementData.measuredAt).toLocaleString(),
        });

        setMeasurement(measurementData);
        return measurementData;
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
    getMeasurement,
    getMeasurementByDeviceId,
    measurement,
    loading,
    error,
    clearError,
    clearMeasurement,
  };
};
