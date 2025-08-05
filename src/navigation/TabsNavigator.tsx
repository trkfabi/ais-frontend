import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ForecastScreen from "../screens/ForecastScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#ff8b32",
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="boat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ForecastTab"
        component={ForecastScreen}
        options={{
          title: "Forecast",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="partly-sunny" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
