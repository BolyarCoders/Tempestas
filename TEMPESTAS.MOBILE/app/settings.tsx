import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useAddDevice } from "../hooks/useAddDevice";
import { useDeviceMeasurements } from "../hooks/useDeviceMesurments";

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

interface DeviceWithData {
  id: string;
  location: string;
  createdAt: string;
  temperature?: number;
  humidity?: number;
  airQuality?: number;
  lastMeasured?: string;
  isActive?: boolean;
}

const STORAGE_KEY = "@tempestas_devices";

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { getMeasurementByDeviceId } = useDeviceMeasurements();
  const { addDevice, loading: addingDevice } = useAddDevice();

  const [devices, setDevices] = useState<DeviceWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState<
    "low" | "medium" | "high"
  >("medium");

  // Add device modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState("");
  const [newDeviceLocation, setNewDeviceLocation] = useState("");

  useEffect(() => {
    loadDevicesFromStorage();
    loadSettings();
  }, []);

  // Load device IDs from AsyncStorage
  const loadDevicesFromStorage = async () => {
    try {
      setLoading(true);
      const storedDevices = await AsyncStorage.getItem(STORAGE_KEY);
      const deviceIds: string[] = storedDevices
        ? JSON.parse(storedDevices)
        : [];

      if (deviceIds.length === 0) {
        setDevices([]);
        return;
      }

      await loadDeviceMeasurements(deviceIds);
    } catch (error) {
      console.error("❌ Error loading devices from storage:", error);
      Alert.alert("Error", "Failed to load devices");
    } finally {
      setLoading(false);
    }
  };

  // Load latest measurements for each device
  const loadDeviceMeasurements = async (deviceIds: string[]) => {
    const devicePromises = deviceIds.map(async (deviceId: string) => {
      try {
        const measurement = await getMeasurementByDeviceId(deviceId);
        return {
          id: deviceId,
          location: deviceId, // fallback: use ID if no name stored
          createdAt: new Date().toISOString(),
          temperature: measurement.temperature,
          humidity: measurement.humidity,
          airQuality: measurement.airQuality,
          lastMeasured: measurement.measuredAt,
          isActive: true,
        } as DeviceWithData;
      } catch {
        return {
          id: deviceId,
          location: deviceId,
          createdAt: new Date().toISOString(),
          isActive: false,
        } as DeviceWithData;
      }
    });

    const loadedDevices = await Promise.all(devicePromises);
    setDevices(loadedDevices);
  };

  // Save device IDs to AsyncStorage
  const saveDevicesToStorage = async (deviceIds: string[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(deviceIds));
  };

  // Add new device
  const handleAddDevice = async () => {
    if (!newDeviceId.trim()) {
      Alert.alert("Error", "Please enter a device ID");
      return;
    }
    if (!newDeviceLocation.trim()) {
      Alert.alert("Error", "Please enter a location name");
      return;
    }

    try {
      // Call hook to add device via API
      await addDevice(newDeviceId.trim(), newDeviceLocation.trim());

      // Update AsyncStorage
      const storedDevices = await AsyncStorage.getItem(STORAGE_KEY);
      const deviceIds: string[] = storedDevices
        ? JSON.parse(storedDevices)
        : [];
      const updatedIds = [...deviceIds, newDeviceId.trim()];
      await saveDevicesToStorage(updatedIds);

      // Update UI
      setDevices((prev) => [
        ...prev,
        {
          id: newDeviceId.trim(),
          location: newDeviceLocation.trim(),
          createdAt: new Date().toISOString(),
          isActive: true,
        },
      ]);

      // Reset modal
      setShowAddModal(false);
      setNewDeviceId("");
      setNewDeviceLocation("");

      Alert.alert("Success", "Device added successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add device");
    }
  };

  // Remove device
  const handleRemoveDevice = async (deviceId: string) => {
    Alert.alert("Remove Device", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            const storedDevices = await AsyncStorage.getItem(STORAGE_KEY);
            const deviceIds: string[] = storedDevices
              ? JSON.parse(storedDevices)
              : [];
            const updatedIds = deviceIds.filter((id) => id !== deviceId);
            await saveDevicesToStorage(updatedIds);
            setDevices((prev) => prev.filter((d) => d.id !== deviceId));
            Alert.alert("Removed", "Device removed");
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to remove device");
          }
        },
      },
    ]);
  };

  // Load settings
  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem(
        "@notifications_enabled",
      );
      const threshold = await AsyncStorage.getItem("@alert_threshold");
      if (notifications !== null)
        setNotificationsEnabled(JSON.parse(notifications));
      if (threshold !== null)
        setAlertThreshold(threshold as "low" | "medium" | "high");
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem("@notifications_enabled", JSON.stringify(value));
  };

  const handleThresholdChange = async (
    threshold: "low" | "medium" | "high",
  ) => {
    setAlertThreshold(threshold);
    await AsyncStorage.setItem("@alert_threshold", threshold);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDevicesFromStorage();
    setRefreshing(false);
  };

  const handleDevicePress = (device: DeviceWithData) => {
    Alert.alert(
      device.location,
      `Device ID: ${device.id}\nStatus: ${device.isActive ? "Active" : "Inactive"}\nCreated: ${new Date(device.createdAt).toLocaleDateString()}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove Device",
          style: "destructive",
          onPress: () => handleRemoveDevice(device.id),
        },
      ],
    );
  };

  const getAQIStatus = (aqi?: number) => {
    if (!aqi) return { color: COLORS.textSecondary, label: "No Data" };
    if (aqi <= 50) return { color: COLORS.statusGood, label: "Good" };
    if (aqi <= 100) return { color: COLORS.statusModerate, label: "Moderate" };
    if (aqi <= 150)
      return { color: COLORS.statusUnhealthy, label: "Unhealthy" };
    return { color: COLORS.statusDanger, label: "Dangerous" };
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      {/* ScrollView */}
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
        {/* Devices Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="hardware-chip-outline"
              size={24}
              color={COLORS.accent}
            />
            <Text style={styles.sectionTitle}>Your Devices</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.accent} />
              <Text style={styles.loadingText}>Loading devices...</Text>
            </View>
          ) : devices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="cube-outline"
                size={48}
                color={COLORS.textSecondary}
              />
              <Text style={styles.emptyText}>No devices found</Text>
              <Text style={styles.emptySubtext}>
                Add a device to get started
              </Text>
            </View>
          ) : (
            <View style={styles.devicesContainer}>
              {devices.map((device) => {
                const aqiStatus = getAQIStatus(device.airQuality);
                return (
                  <TouchableOpacity
                    key={device.id}
                    style={styles.deviceCard}
                    onPress={() => handleDevicePress(device)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.deviceLeft}>
                      <LinearGradient
                        colors={
                          device.isActive
                            ? [COLORS.primary, COLORS.accent]
                            : ["#334155", "#475569"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.deviceIcon}
                      >
                        <Ionicons
                          name={
                            device.isActive
                              ? "checkmark-circle"
                              : "warning-outline"
                          }
                          size={24}
                          color="#FFFFFF"
                        />
                      </LinearGradient>
                      <View style={styles.deviceInfo}>
                        <Text style={styles.deviceName}>{device.location}</Text>
                        {device.isActive ? (
                          <View style={styles.deviceStats}>
                            <Text style={styles.deviceStat}>
                              {device.temperature?.toFixed(1)}°C
                            </Text>
                            <Text style={styles.deviceStatSeparator}>•</Text>
                            <Text style={styles.deviceStat}>
                              {device.humidity?.toFixed(0)}%
                            </Text>
                            <Text style={styles.deviceStatSeparator}>•</Text>
                            <Text
                              style={[
                                styles.deviceStat,
                                { color: aqiStatus.color },
                              ]}
                            >
                              AQI {device.airQuality}
                            </Text>
                          </View>
                        ) : (
                          <Text style={styles.deviceInactive}>
                            No measurements yet
                          </Text>
                        )}
                        {device.lastMeasured && (
                          <Text style={styles.deviceTime}>
                            Updated{" "}
                            {new Date(device.lastMeasured).toLocaleTimeString(
                              "en-US",
                              { hour: "numeric", minute: "2-digit" },
                            )}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Add Device Button */}
          <TouchableOpacity
            style={styles.addDeviceButton}
            onPress={() => setShowAddModal(true)}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addDeviceGradient}
            >
              <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
              <Text style={styles.addDeviceText}>Add New Device</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Notifications, Alert Threshold, About Sections remain the same */}
        {/* ... You can copy your previous styles and JSX here ... */}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Device Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Device</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Device ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Device ID"
                placeholderTextColor={COLORS.textSecondary}
                value={newDeviceId}
                onChangeText={setNewDeviceId}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.inputLabel}>Location Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Location Name"
                placeholderTextColor={COLORS.textSecondary}
                value={newDeviceLocation}
                onChangeText={setNewDeviceLocation}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddDevice}
                disabled={addingDevice}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addButtonGradient}
                >
                  {addingDevice ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.addButtonText}>Add Device</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  devicesContainer: {
    gap: 12,
    marginBottom: 16,
  },
  deviceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  deviceLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  deviceStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  deviceStat: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  deviceStatSeparator: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginHorizontal: 6,
  },
  deviceInactive: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  deviceTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addDeviceButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addDeviceGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  addDeviceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  settingCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  thresholdContainer: {
    flexDirection: "row",
    gap: 12,
  },
  thresholdCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  thresholdCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
  thresholdIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  thresholdIconActive: {
    backgroundColor: COLORS.primary + "20",
  },
  thresholdLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  thresholdDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  menuItem: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: COLORS.primary + "15",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  infoBoxText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 8,
    lineHeight: 18,
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  addButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  addButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default SettingsScreen;
