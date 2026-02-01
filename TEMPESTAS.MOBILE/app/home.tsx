import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDevicePredictions } from "../hooks/useAIPrediction";
import { useDeviceMeasurements } from "../hooks/useDeviceMesurments";

const { width } = Dimensions.get("window");

// Color palette
const COLORS = {
  primary: "#2563EB",
  accent: "#22D3EE",
  background: "#0F172A",
  card: "#020617",
  statusGood: "#22C55E",
  statusModerate: "#EAB308",
  statusUnhealthy: "#F97316",
  statusDanger: "#EF4444",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
};

interface AQIStatus {
  label: string;
  color: string;
  icon: string;
  description: string;
}

const getAQIStatus = (aqi: number): AQIStatus => {
  if (aqi <= 50) {
    return {
      label: "Good",
      color: COLORS.statusGood,
      icon: "checkmark-circle",
      description: "Air quality is excellent",
    };
  } else if (aqi <= 100) {
    return {
      label: "Moderate",
      color: COLORS.statusModerate,
      icon: "warning",
      description: "Acceptable for most people",
    };
  } else if (aqi <= 150) {
    return {
      label: "Unhealthy",
      color: COLORS.statusUnhealthy,
      icon: "alert-circle",
      description: "Sensitive groups may be affected",
    };
  } else {
    return {
      label: "Dangerous",
      color: COLORS.statusDanger,
      icon: "close-circle",
      description: "Everyone may experience health effects",
    };
  }
};

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { getMeasurementByDeviceId, measurement, loading, error } =
    useDeviceMeasurements();
  const {
    getPredictionByDeviceId,
    prediction,
    loading: predictionLoading,
    error: predictionError,
  } = useDevicePredictions();

  // State for current data
  const [currentAQI, setCurrentAQI] = useState(45);
  const [temperature, setTemperature] = useState(22.5);
  const [humidity, setHumidity] = useState(65);
  const [refreshing, setRefreshing] = useState(false);

  // Use the hardcoded device ID
  const DEVICE_ID = "21c22fce-d945-48cc-a5cd-4a0b4897d160";

  // Mock data for features not yet implemented
  const [pm25] = useState(12.3);
  const [pm10] = useState(28.7);

  const aqiStatus = getAQIStatus(currentAQI);

  // Mock historical data for trends
  const hourlyData = [32, 35, 38, 42, 45, 48, 52, 55];

  // Fetch measurement data on component mount
  useEffect(() => {
    loadMeasurement();
    loadPrediction();
  }, []);

  // Update state when measurement data is fetched
  useEffect(() => {
    if (measurement) {
      console.log("📊 Updating UI with measurement data:", measurement);
      setTemperature(measurement.temperature);
      setHumidity(measurement.humidity);
      setCurrentAQI(measurement.airQuality);
    }
  }, [measurement]);

  const loadMeasurement = async () => {
    try {
      console.log("🔄 Loading latest measurement for device...");
      await getMeasurementByDeviceId(DEVICE_ID);
    } catch (err) {
      console.error("❌ Failed to load measurement:", err);
      // Keep using mock data if API fails
    }
  };

  const loadPrediction = async () => {
    try {
      console.log("🔄 Loading latest prediction for device...");
      await getPredictionByDeviceId(DEVICE_ID);
    } catch (err) {
      console.error("❌ Failed to load prediction:", err);
      // Keep using mock data if API fails
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadMeasurement(), loadPrediction()]);
    setRefreshing(false);
  };

  // Format prediction time
  const formatPredictionTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get prediction status
  const getPredictionStatus = (aqi: number) => {
    const status = getAQIStatus(aqi);
    return {
      level: status.label,
      color: status.color,
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tempestas</Text>
          <Text style={styles.headerSubtitle}>Sofia, Bulgaria</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            router.push("/settings");
          }}
          style={styles.settingsButton}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
      >
        {/* Loading State */}
        {loading && !measurement && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>Loading data...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !measurement && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle"
              size={48}
              color={COLORS.statusDanger}
            />
            <Text style={styles.errorTitle}>Unable to load data</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadMeasurement}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Main AQI Card */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          <View style={styles.aqiHeader}>
            <Ionicons name={aqiStatus.icon as any} size={32} color="#FFFFFF" />
            <Text style={styles.statusLabel}>{aqiStatus.label}</Text>
          </View>

          <View style={styles.aqiValueContainer}>
            <Text style={styles.aqiValue}>{currentAQI}</Text>
            <Text style={styles.aqiUnit}>AQI</Text>
          </View>

          <Text style={styles.aqiDescription}>{aqiStatus.description}</Text>

          {/* Data source indicator */}
          {measurement && (
            <View style={styles.dataSourceBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
              <Text style={styles.dataSourceText}>Live Data</Text>
            </View>
          )}

          {/* Color indicator bar */}
          <View style={styles.colorIndicator}>
            <View
              style={[
                styles.colorSegment,
                { backgroundColor: COLORS.statusGood },
              ]}
            />
            <View
              style={[
                styles.colorSegment,
                { backgroundColor: COLORS.statusModerate },
              ]}
            />
            <View
              style={[
                styles.colorSegment,
                { backgroundColor: COLORS.statusUnhealthy },
              ]}
            />
            <View
              style={[
                styles.colorSegment,
                { backgroundColor: COLORS.statusDanger },
              ]}
            />
          </View>
        </LinearGradient>

        {/* Environmental Readings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Conditions</Text>
          {measurement && (
            <View style={styles.timestampContainer}>
              <Ionicons
                name="time-outline"
                size={14}
                color={COLORS.textSecondary}
              />
              <Text style={styles.timestampText}>
                {new Date(measurement.measuredAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.readingsGrid}>
          <View style={styles.readingCard}>
            <Ionicons
              name="thermometer-outline"
              size={28}
              color={COLORS.accent}
            />
            <Text style={styles.readingValue}>{temperature.toFixed(1)}°C</Text>
            <Text style={styles.readingLabel}>Temperature</Text>
          </View>

          <View style={styles.readingCard}>
            <Ionicons name="water-outline" size={28} color={COLORS.accent} />
            <Text style={styles.readingValue}>{humidity.toFixed(0)}%</Text>
            <Text style={styles.readingLabel}>Humidity</Text>
          </View>

          <View style={styles.readingCard}>
            <Ionicons name="cloud-outline" size={28} color={COLORS.accent} />
            <Text style={styles.readingValue}>{pm25}</Text>
            <Text style={styles.readingLabel}>PM2.5 µg/m³</Text>
          </View>

          <View style={styles.readingCard}>
            <Ionicons
              name="partly-sunny-outline"
              size={28}
              color={COLORS.accent}
            />
            <Text style={styles.readingValue}>{pm10}</Text>
            <Text style={styles.readingLabel}>PM10 µg/m³</Text>
          </View>
        </View>

        {/* Historical Trends */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Trend</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.trendCard}>
          <View style={styles.chartContainer}>
            {hourlyData.map((value, index) => {
              const height = (value / Math.max(...hourlyData)) * 100;
              const color =
                value <= 50 ? COLORS.statusGood : COLORS.statusModerate;

              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${height}%`,
                          backgroundColor: color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{8 + index * 2}:00</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* AI Predictions */}
        <View style={styles.sectionHeader}>
          <Ionicons name="bulb-outline" size={20} color={COLORS.accent} />
          <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>
            AI Predictions
          </Text>
        </View>

        {/* Prediction Loading State */}
        {predictionLoading && !prediction && (
          <View style={styles.predictionLoadingContainer}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.loadingText}>Loading predictions...</Text>
          </View>
        )}

        {/* Prediction Error State */}
        {predictionError && !prediction && (
          <View style={styles.predictionErrorContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={24}
              color={COLORS.statusDanger}
            />
            <Text style={styles.predictionErrorText}>{predictionError}</Text>
          </View>
        )}

        {/* Display Prediction */}
        {prediction && (
          <View style={styles.predictionCard}>
            <View style={styles.predictionTime}>
              <Ionicons
                name="time-outline"
                size={20}
                color={COLORS.textSecondary}
              />
              <Text style={styles.predictionTimeText}>
                {formatPredictionTime(prediction.predictedFor)}
              </Text>
            </View>
            <View style={styles.predictionDetails}>
              <Text style={styles.predictionAQI}>
                AQI {prediction.airQuality}
              </Text>
              <View
                style={[
                  styles.predictionBadge,
                  {
                    backgroundColor:
                      getPredictionStatus(prediction.airQuality).color + "30",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.predictionLevel,
                    {
                      color: getPredictionStatus(prediction.airQuality).color,
                    },
                  ]}
                >
                  {getPredictionStatus(prediction.airQuality).level}
                </Text>
              </View>
            </View>
            {/* Confidence Indicator */}
            <View style={styles.confidenceContainer}>
              <Ionicons
                name="analytics-outline"
                size={14}
                color={COLORS.textSecondary}
              />
              <Text style={styles.confidenceText}>
                {(prediction.confidence * 100).toFixed(0)}% confidence
              </Text>
            </View>
          </View>
        )}

        {/* Alert Card */}
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.statusGood}
            />
            <Text style={styles.alertTitle}>Air Quality Alert</Text>
          </View>
          <Text style={styles.alertText}>
            No alerts at this time. You'll be notified when air quality changes.
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/alerts");
            }}
            style={styles.alertButton}
          >
            <Text style={styles.alertButtonText}>Configure Alerts</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  mainCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  aqiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 12,
  },
  aqiValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  aqiValue: {
    fontSize: 72,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -2,
  },
  aqiUnit: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
    opacity: 0.9,
  },
  aqiDescription: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
    opacity: 0.9,
  },
  dataSourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  dataSourceText: {
    fontSize: 11,
    color: "#FFFFFF",
    marginLeft: 4,
    fontWeight: "600",
  },
  colorIndicator: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    gap: 2,
  },
  colorSegment: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timestampText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: "600",
  },
  readingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 28,
  },
  readingCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  readingValue: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  readingLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  trendCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
  },
  barWrapper: {
    width: "100%",
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    width: "60%",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  predictionLoadingContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  predictionErrorContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  predictionErrorText: {
    fontSize: 14,
    color: COLORS.statusDanger,
    flex: 1,
  },
  predictionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  predictionTime: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  predictionTimeText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 8,
    fontWeight: "600",
  },
  predictionDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  predictionAQI: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  predictionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  predictionLevel: {
    fontSize: 12,
    fontWeight: "700",
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  confidenceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  alertCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.2)",
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  alertText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  alertButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary + "20",
    borderRadius: 10,
    paddingVertical: 12,
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginRight: 6,
  },
});

export default HomeScreen;
