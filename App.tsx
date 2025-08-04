import "react-native-gesture-handler";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { StatusBar } from "expo-status-bar";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

const queryClient = new QueryClient();
const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            drawerType: "slide",
            drawerStyle: {
              backgroundColor: "white",
            },
            drawerLabelStyle: {
              color: "#ff8b32",
              fontSize: 16,
              fontWeight: "500",
            },
            drawerActiveTintColor: "#ff8b32",
            drawerInactiveTintColor: "rgba(171, 81, 2, 0.7)",
          }}
        >
          <Drawer.Screen
            name="Vessels Map"
            component={HomeScreen}
            options={{
              drawerIcon: ({
                color,
                size,
              }: {
                color: string;
                size: number;
              }) => <Ionicons name="boat" color={color} size={size} />,
              headerStyle: {
                backgroundColor: "#ff8b32",
              },
              headerTintColor: "white",
              headerTitle: "Vessel Tracker",
            }}
          />
          <Drawer.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              drawerIcon: ({
                color,
                size,
              }: {
                color: string;
                size: number;
              }) => <Ionicons name="settings" color={color} size={size} />,
            }}
          />
          <Drawer.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              drawerIcon: ({
                color,
                size,
              }: {
                color: string;
                size: number;
              }) => <Ionicons name="person" color={color} size={size} />,
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default gestureHandlerRootHOC(App);
