import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

const APP_VERSION = (Constants.expoConfig as any)?.version || "1.0.0";
const APP_BUILD = (Constants.expoConfig as any)?.ios?.buildNumber || "1";

const CustomDrawer = (props: any) => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/icon.png")}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>
      </View>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "white", paddingTop: 30 }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out" size={22} color="#ff8b32" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>
          v{APP_VERSION} (build {APP_BUILD})
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ff8b32",
    paddingTop: 45,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    backgroundColor: "white",
  },
  name: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 2,
  },
  email: {
    color: "white",
    fontSize: 13,
    opacity: 0.9,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginHorizontal: 8,
    marginBottom: 4,
    borderRadius: 12,
  },
  logoutText: {
    color: "#ff8b32",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  versionText: {
    color: "#b8b8b8",
    fontSize: 13,
    fontWeight: "500",
  },
});

export default CustomDrawer;
