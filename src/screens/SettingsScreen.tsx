import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#767577", true: "#ff8b32" }}
            thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="location" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>Location Services</Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: "#767577", true: "#ff8b32" }}
            thumbColor={locationEnabled ? "#fff" : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: "#767577", true: "#ff8b32" }}
            thumbColor={darkModeEnabled ? "#fff" : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="information-circle" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>App Version</Text>
          </View>
          <Text style={styles.settingValue}>1.0.0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="help-circle" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 16,
    color: "#666",
  },
});

export default SettingsScreen;
