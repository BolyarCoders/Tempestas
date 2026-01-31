import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

type AlertLevel = "auto" | "high" | "medium" | "low" | "custom";

interface AlertPreset {
  id: AlertLevel;
  name: string;
  description: string;
  icon: string;
  aqiThreshold?: number;
  color: string;
}

const alertPresets: AlertPreset[] = [
  {
    id: "auto",
    name: "Auto (Recommended)",
    description: "Based on your health profile",
    icon: "sparkles",
    color: COLORS.accent,
  },
  {
    id: "high",
    name: "High Sensitivity",
    description: "Alert at AQI 50+ (Good to Moderate)",
    icon: "shield-checkmark",
    aqiThreshold: 50,
    color: COLORS.statusGood,
  },
  {
    id: "medium",
    name: "Medium Sensitivity",
    description: "Alert at AQI 100+ (Moderate to Unhealthy)",
    icon: "notifications",
    aqiThreshold: 100,
    color: COLORS.statusModerate,
  },
  {
    id: "low",
    name: "Low Sensitivity",
    description: "Alert at AQI 150+ (Unhealthy)",
    icon: "alert-circle",
    aqiThreshold: 150,
    color: COLORS.statusUnhealthy,
  },
];

const AirQualityAlertsScreen: React.FC = () => {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<AlertLevel>("auto");
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);
  const [customThreshold, setCustomThreshold] = useState(75);

  const handleLevelSelect = (level: AlertLevel) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedLevel(level);
    if (level !== "custom") {
      setIsCustomExpanded(false);
    }
  };

  const handleCustomPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedLevel("custom");
    setIsCustomExpanded(!isCustomExpanded);
  };

  const getThresholdColor = (value: number) => {
    if (value <= 50) return COLORS.statusGood;
    if (value <= 100) return COLORS.statusModerate;
    if (value <= 150) return COLORS.statusUnhealthy;
    return COLORS.statusDanger;
  };

  const getThresholdLabel = (value: number) => {
    if (value <= 50) return "Good";
    if (value <= 100) return "Moderate";
    if (value <= 150) return "Unhealthy";
    return "Dangerous";
  };

  const handleSave = () => {
    // Save alert settings
    const alertSettings = {
      level: selectedLevel,
      customThreshold: selectedLevel === "custom" ? customThreshold : null,
    };
    console.log("Saving alert settings:", alertSettings);

    // Navigate back or to home
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Alert Settings</Text>
          <Text style={styles.headerSubtitle}>
            Customize your notifications
          </Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <LinearGradient
            colors={[COLORS.primary + "30", COLORS.accent + "20"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.infoBannerGradient}
          >
            <Ionicons name="bulb" size={24} color={COLORS.accent} />
            <View style={styles.infoBannerText}>
              <Text style={styles.infoBannerTitle}>Smart Alerts</Text>
              <Text style={styles.infoBannerDescription}>
                Get notified when air quality reaches levels that matter to you
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Alert Level Presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alert Sensitivity</Text>
          <Text style={styles.sectionDescription}>
            Choose when you want to receive air quality notifications
          </Text>

          <View style={styles.presetsContainer}>
            {alertPresets.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                style={[
                  styles.presetCard,
                  selectedLevel === preset.id && styles.presetCardActive,
                ]}
                onPress={() => handleLevelSelect(preset.id)}
                activeOpacity={0.7}
              >
                <View style={styles.presetLeft}>
                  <View
                    style={[
                      styles.presetIcon,
                      selectedLevel === preset.id && {
                        backgroundColor: preset.color + "20",
                      },
                    ]}
                  >
                    <Ionicons
                      name={preset.icon as any}
                      size={24}
                      color={
                        selectedLevel === preset.id
                          ? preset.color
                          : COLORS.textSecondary
                      }
                    />
                  </View>

                  <View style={styles.presetInfo}>
                    <Text style={styles.presetName}>{preset.name}</Text>
                    <Text style={styles.presetDescription}>
                      {preset.description}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.radioButton,
                    selectedLevel === preset.id && styles.radioButtonActive,
                  ]}
                >
                  {selectedLevel === preset.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* Custom Option */}
            <TouchableOpacity
              style={[
                styles.presetCard,
                selectedLevel === "custom" && styles.presetCardActive,
                isCustomExpanded && styles.presetCardExpanded,
              ]}
              onPress={handleCustomPress}
              activeOpacity={0.7}
            >
              <View style={styles.presetLeft}>
                <View
                  style={[
                    styles.presetIcon,
                    selectedLevel === "custom" && {
                      backgroundColor: COLORS.primary + "20",
                    },
                  ]}
                >
                  <Ionicons
                    name="options"
                    size={24}
                    color={
                      selectedLevel === "custom"
                        ? COLORS.primary
                        : COLORS.textSecondary
                    }
                  />
                </View>

                <View style={styles.presetInfo}>
                  <Text style={styles.presetName}>Custom</Text>
                  <Text style={styles.presetDescription}>
                    {isCustomExpanded
                      ? `Alert at AQI ${customThreshold}+`
                      : "Set your own threshold"}
                  </Text>
                </View>
              </View>

              <View style={styles.customRight}>
                <View
                  style={[
                    styles.radioButton,
                    selectedLevel === "custom" && styles.radioButtonActive,
                  ]}
                >
                  {selectedLevel === "custom" && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Ionicons
                  name={isCustomExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={COLORS.textSecondary}
                  style={{ marginLeft: 8 }}
                />
              </View>
            </TouchableOpacity>

            {/* Custom Slider - Expanded */}
            {isCustomExpanded && (
              <View style={styles.customSliderContainer}>
                {/* Large AQI Display */}
                <View style={styles.aqiDisplayContainer}>
                  <LinearGradient
                    colors={[
                      getThresholdColor(customThreshold) + "40",
                      getThresholdColor(customThreshold) + "10",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.aqiDisplayGradient}
                  >
                    <Text style={styles.aqiDisplayLabel}>Alert Threshold</Text>
                    <View style={styles.aqiDisplayValueContainer}>
                      <Text
                        style={[
                          styles.aqiDisplayValue,
                          { color: getThresholdColor(customThreshold) },
                        ]}
                      >
                        {customThreshold}
                      </Text>
                      <View style={styles.aqiDisplayUnit}>
                        <Text style={styles.aqiDisplayUnitText}>AQI</Text>
                        <View
                          style={[
                            styles.aqiDisplayBadge,
                            {
                              backgroundColor:
                                getThresholdColor(customThreshold) + "30",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.aqiDisplayBadgeText,
                              { color: getThresholdColor(customThreshold) },
                            ]}
                          >
                            {getThresholdLabel(customThreshold)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.aqiDisplayDescription}>
                      {customThreshold <= 50
                        ? "Very sensitive - alerts for all changes"
                        : customThreshold <= 100
                          ? "Moderate sensitivity - balanced alerting"
                          : customThreshold <= 150
                            ? "Low sensitivity - only unhealthy levels"
                            : "Minimal alerts - only dangerous levels"}
                    </Text>
                  </LinearGradient>
                </View>

                {/* Enhanced Slider */}
                <View style={styles.enhancedSliderWrapper}>
                  <Slider
                    style={styles.enhancedSlider}
                    minimumValue={0}
                    maximumValue={200}
                    step={5}
                    value={customThreshold}
                    onValueChange={setCustomThreshold}
                    minimumTrackTintColor="transparent"
                    maximumTrackTintColor="transparent"
                    thumbTintColor="transparent"
                  />

                  <View style={styles.sliderTrackContainer}>
                    {/* Background gradient track */}
                    <LinearGradient
                      colors={[
                        COLORS.statusGood,
                        COLORS.statusModerate,
                        COLORS.statusUnhealthy,
                        COLORS.statusDanger,
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.sliderGradientTrack}
                    />

                    {/* Threshold marker */}
                    <View
                      style={[
                        styles.thresholdMarker,
                        { left: `${(customThreshold / 200) * 100}%` },
                      ]}
                    >
                      <View
                        style={[
                          styles.thresholdLine,
                          {
                            backgroundColor: getThresholdColor(customThreshold),
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.thresholdDot,
                          {
                            backgroundColor: getThresholdColor(customThreshold),
                            shadowColor: getThresholdColor(customThreshold),
                          },
                        ]}
                      >
                        <View style={styles.thresholdDotInner} />
                      </View>
                    </View>
                  </View>

                  {/* AQI Scale Labels */}
                  <View style={styles.scaleLabelsContainer}>
                    <View style={styles.scaleLabel}>
                      <View
                        style={[
                          styles.scaleLabelDot,
                          { backgroundColor: COLORS.statusGood },
                        ]}
                      />
                      <Text style={styles.scaleLabelValue}>0</Text>
                      <Text style={styles.scaleLabelText}>Good</Text>
                    </View>
                    <View style={styles.scaleLabel}>
                      <View
                        style={[
                          styles.scaleLabelDot,
                          { backgroundColor: COLORS.statusModerate },
                        ]}
                      />
                      <Text style={styles.scaleLabelValue}>50</Text>
                      <Text style={styles.scaleLabelText}>Moderate</Text>
                    </View>
                    <View style={styles.scaleLabel}>
                      <View
                        style={[
                          styles.scaleLabelDot,
                          { backgroundColor: COLORS.statusUnhealthy },
                        ]}
                      />
                      <Text style={styles.scaleLabelValue}>100</Text>
                      <Text style={styles.scaleLabelText}>Unhealthy</Text>
                    </View>
                    <View style={styles.scaleLabel}>
                      <View
                        style={[
                          styles.scaleLabelDot,
                          { backgroundColor: COLORS.statusDanger },
                        ]}
                      />
                      <Text style={styles.scaleLabelValue}>150</Text>
                      <Text style={styles.scaleLabelText}>Dangerous</Text>
                    </View>
                  </View>
                </View>

                {/* Info Cards */}
                <View style={styles.sliderInfoCards}>
                  <View style={styles.sliderInfoCard}>
                    <Ionicons
                      name="notifications"
                      size={20}
                      color={getThresholdColor(customThreshold)}
                    />
                    <View style={styles.sliderInfoCardText}>
                      <Text style={styles.sliderInfoCardTitle}>
                        Alert Frequency
                      </Text>
                      <Text style={styles.sliderInfoCardDescription}>
                        {customThreshold <= 50
                          ? "High - Multiple daily alerts expected"
                          : customThreshold <= 100
                            ? "Medium - Several alerts per week"
                            : customThreshold <= 150
                              ? "Low - Occasional alerts"
                              : "Rare - Only severe conditions"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sliderInfoCard}>
                    <Ionicons name="fitness" size={20} color={COLORS.accent} />
                    <View style={styles.sliderInfoCardText}>
                      <Text style={styles.sliderInfoCardTitle}>
                        Health Impact
                      </Text>
                      <Text style={styles.sliderInfoCardDescription}>
                        {customThreshold <= 50
                          ? "Excellent protection for sensitive groups"
                          : customThreshold <= 100
                            ? "Good protection for most people"
                            : customThreshold <= 150
                              ? "Standard protection"
                              : "Minimal protection - not recommended"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Quick Presets */}
                <View style={styles.quickPresetsContainer}>
                  <Text style={styles.quickPresetsTitle}>Quick Adjust</Text>
                  <View style={styles.quickPresets}>
                    {[25, 50, 100, 150].map((value) => (
                      <TouchableOpacity
                        key={value}
                        style={[
                          styles.quickPresetButton,
                          customThreshold === value &&
                            styles.quickPresetButtonActive,
                          {
                            borderColor:
                              customThreshold === value
                                ? getThresholdColor(value)
                                : "rgba(255, 255, 255, 0.1)",
                          },
                        ]}
                        onPress={() => setCustomThreshold(value)}
                      >
                        <Text
                          style={[
                            styles.quickPresetButtonText,
                            customThreshold === value && {
                              color: getThresholdColor(value),
                            },
                          ]}
                        >
                          {value}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Additional Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <Ionicons name="phone-portrait" size={20} color={COLORS.accent} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <View style={styles.settingBadge}>
              <Text style={styles.settingBadgeText}>Enabled</Text>
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high" size={20} color={COLORS.accent} />
              <Text style={styles.settingText}>Voice Alerts</Text>
            </View>
            <View style={styles.settingBadge}>
              <Text style={styles.settingBadgeText}>Enabled</Text>
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <Ionicons name="time" size={20} color={COLORS.accent} />
              <Text style={styles.settingText}>Quiet Hours</Text>
            </View>
            <View style={styles.settingBadge}>
              <Text style={styles.settingBadgeText}>10 PM - 7 AM</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Text style={styles.saveButtonText}>Save Settings</Text>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  infoBanner: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  infoBannerGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  infoBannerText: {
    flex: 1,
    marginLeft: 16,
  },
  infoBannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  infoBannerDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  presetsContainer: {
    gap: 12,
  },
  presetCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  presetCardActive: {
    borderColor: COLORS.primary,
  },
  presetCardExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  presetLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  presetIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  customRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonActive: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  customSliderContainer: {
    backgroundColor: COLORS.card,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    padding: 24,
    marginTop: -20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: COLORS.primary,
    gap: 24,
  },
  aqiDisplayContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  aqiDisplayGradient: {
    padding: 24,
    alignItems: "center",
  },
  aqiDisplayLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  aqiDisplayValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  aqiDisplayValue: {
    fontSize: 64,
    fontWeight: "900",
    letterSpacing: -2,
  },
  aqiDisplayUnit: {
    alignItems: "flex-start",
    gap: 6,
  },
  aqiDisplayUnitText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  aqiDisplayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  aqiDisplayBadgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  aqiDisplayDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  enhancedSliderWrapper: {
    gap: 16,
  },
  enhancedSlider: {
    width: "100%",
    height: 40,
    zIndex: 10,
  },
  sliderTrackContainer: {
    height: 8,
    position: "absolute",
    top: 16,
    left: 8,
    right: 8,
    pointerEvents: "none",
  },
  sliderGradientTrack: {
    height: 8,
    borderRadius: 4,
    opacity: 0.3,
  },
  thresholdMarker: {
    position: "absolute",
    top: -16,
    bottom: -16,
    width: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -1,
    pointerEvents: "none",
  },
  thresholdLine: {
    width: 2,
    height: 40,
    borderRadius: 1,
    opacity: 0.5,
  },
  thresholdDot: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  thresholdDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },

  scaleLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  scaleLabel: {
    alignItems: "center",
    gap: 4,
  },
  scaleLabelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  scaleLabelValue: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  scaleLabelText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  sliderInfoCards: {
    gap: 12,
  },
  sliderInfoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(148, 163, 184, 0.05)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  sliderInfoCardText: {
    flex: 1,
    marginLeft: 12,
  },
  sliderInfoCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sliderInfoCardDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  quickPresetsContainer: {
    marginTop: 8,
  },
  quickPresetsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  quickPresets: {
    flexDirection: "row",
    gap: 8,
  },
  quickPresetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    backgroundColor: "rgba(148, 163, 184, 0.05)",
  },
  quickPresetButtonActive: {
    backgroundColor: "rgba(37, 99, 235, 0.1)",
  },
  quickPresetButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  settingCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  settingBadge: {
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  settingBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  saveButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});

export default AirQualityAlertsScreen;
