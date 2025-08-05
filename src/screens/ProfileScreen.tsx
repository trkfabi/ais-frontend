import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ProfileStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ProfileNavProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "ProfileMain"
>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileNavProp>();
  return (
    <View style={styles.container}>
      {/* User Info Section */}
      <View style={styles.section}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.avatar}
            />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
            <Text style={styles.userRole}>Premium User</Text>
          </View>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="person" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="lock-closed" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="mail" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>Email Preferences</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Subscription Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="diamond" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>Premium Plan</Text>
          </View>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Active</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate("BillingHistory")}
        >
          <View style={styles.settingInfo}>
            <Ionicons name="calendar" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>Billing History</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="card" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>Payment Methods</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Data & Privacy Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="download" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>Export Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="shield-checkmark" size={24} color="#ff8b32" />
            <Text style={styles.settingText}>Privacy Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out" size={24} color="#ff8b32" />
          <Text style={styles.logoutText}>Log Out</Text>
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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: "#ff8b32",
    fontWeight: "600",
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
  premiumBadge: {
    backgroundColor: "#ff8b32",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  logoutText: {
    fontSize: 16,
    color: "#ff8b32",
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ProfileScreen;
