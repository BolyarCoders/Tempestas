import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

interface HealthCondition {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const healthConditions: HealthCondition[] = [
  {
    id: "asthma",
    name: "Asthma",
    icon: "fitness-outline",
    description: "Chronic respiratory condition affecting airways",
  },
  {
    id: "allergies",
    name: "Allergies",
    icon: "flower-outline",
    description: "Seasonal or environmental allergies",
  },
  {
    id: "copd",
    name: "COPD",
    icon: "pulse-outline",
    description: "Chronic obstructive pulmonary disease",
  },
  {
    id: "cardiovascular",
    name: "Cardiovascular Disease",
    icon: "heart-outline",
    description: "Heart or blood vessel conditions",
  },
  {
    id: "respiratory",
    name: "Other Respiratory Issues",
    icon: "medkit-outline",
    description: "Bronchitis, emphysema, or other lung conditions",
  },
  {
    id: "children",
    name: "Young Children at Home",
    icon: "people-outline",
    description: "Children under 12 are more sensitive to air quality",
  },
  {
    id: "elderly",
    name: "Elderly at Home",
    icon: "accessibility-outline",
    description: "Seniors 65+ are more vulnerable to pollution",
  },
];

const OnboardingScreen: React.FC = () => {
  const router = useRouter();
  const [selectedConditions, setSelectedConditions] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleCondition = (id: string) => {
    setSelectedConditions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleContinue = () => {
    // Save selected conditions to AsyncStorage or state management
    const activeConditions = Object.keys(selectedConditions).filter(
      (key) => selectedConditions[key],
    );
    console.log("Selected health conditions:", activeConditions);

    // Navigate to home screen using expo-router
    router.push("/home");
  };

  const hasSelections = Object.values(selectedConditions).some((v) => v);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Ionicons name="shield-checkmark" size={48} color="#FFFFFF" />
          </LinearGradient>

          <Text style={styles.title}>Personalize Your Protection</Text>
          <Text style={styles.subtitle}>
            Help us tailor air quality alerts to your health needs. Select any
            conditions that apply to you or your household.
          </Text>
        </View>

        {/* Health Conditions List */}
        <View style={styles.conditionsContainer}>
          {healthConditions.map((condition, index) => (
            <View
              key={condition.id}
              style={[
                styles.conditionCard,
                selectedConditions[condition.id] && styles.conditionCardActive,
              ]}
            >
              <View style={styles.conditionLeft}>
                <View
                  style={[
                    styles.conditionIcon,
                    selectedConditions[condition.id] &&
                      styles.conditionIconActive,
                  ]}
                >
                  <Ionicons
                    name={condition.icon as any}
                    size={24}
                    color={
                      selectedConditions[condition.id]
                        ? COLORS.primary
                        : COLORS.textSecondary
                    }
                  />
                </View>

                <View style={styles.conditionInfo}>
                  <Text style={styles.conditionName}>{condition.name}</Text>
                  <Text style={styles.conditionDescription}>
                    {condition.description}
                  </Text>
                </View>
              </View>

              <Switch
                value={selectedConditions[condition.id] || false}
                onValueChange={() => toggleCondition(condition.id)}
                trackColor={{
                  false: "#334155",
                  true: COLORS.primary,
                }}
                thumbColor={
                  selectedConditions[condition.id] ? "#FFFFFF" : "#94A3B8"
                }
                ios_backgroundColor="#334155"
              />
            </View>
          ))}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={COLORS.accent} />
          <Text style={styles.infoText}>
            This information helps us send you more relevant alerts and
            recommendations. You can change these settings anytime.
          </Text>
        </View>

        {/* Skip Option */}
        <TouchableOpacity style={styles.skipButton} onPress={handleContinue}>
          <Text style={styles.skipText}>
            {hasSelections ? "None of these apply" : "Skip for now"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !hasSelections && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              hasSelections
                ? [COLORS.primary, COLORS.accent]
                : ["#334155", "#475569"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueGradient}
          >
            <Text style={styles.continueButtonText}>
              {hasSelections ? "Continue" : "Select at least one condition"}
            </Text>
            {hasSelections && (
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  conditionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  conditionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  conditionCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
  conditionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  conditionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  conditionIconActive: {
    backgroundColor: COLORS.primary + "20",
  },
  conditionInfo: {
    flex: 1,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  conditionDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: COLORS.primary + "15",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginLeft: 12,
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
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
  continueButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  continueGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});

export default OnboardingScreen;
