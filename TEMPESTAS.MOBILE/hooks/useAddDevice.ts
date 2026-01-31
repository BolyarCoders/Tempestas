import { useCallback, useState } from "react";

const BASE_URL = "https://tempestas-16da.onrender.com";
const DEVICE_ID = "21c22fce-d945-48cc-a5cd-4a0b4897d160";

interface DeviceInput {
  location: string;
  id?: string;
  createdAt?: string;
}

interface ApiError {
  error: string;
}

interface UseAddDeviceReturn {
  addDevice: (location: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useAddDevice = (): UseAddDeviceReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const addDevice = useCallback(async (location: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const deviceData: DeviceInput = {
        id: DEVICE_ID,
        location,
        createdAt: new Date().toISOString(),
      };

      console.log("📤 Request to add device:", deviceData);

      const response = await fetch(`${BASE_URL}/api/device`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceData),
      });

      console.log("📥 Response status:", response.status, response.statusText);

      if (!response.ok) {
        // Try to parse error response
        let errorMessage = "Failed to add device";
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

      // Try to read the response body if any
      const responseText = await response.text();
      if (responseText) {
        try {
          const responseData = JSON.parse(responseText);
          console.log("✅ Success response:", responseData);
        } catch {
          console.log("✅ Success response (text):", responseText);
        }
      } else {
        console.log("✅ Success - 201 Created (empty body)");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("🔥 Exception caught:", err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addDevice,
    loading,
    error,
    clearError,
  };
};
