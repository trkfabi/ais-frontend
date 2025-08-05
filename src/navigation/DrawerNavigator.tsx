import React from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawer from "../components/CustomDrawer";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileStackNavigator from "./ProfileStackNavigator";
import { DrawerParamList, ParamListBase, RouteProp } from "./types";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// 🔹 Función global para decidir si mostrar el header del Drawer
function getDrawerScreenOptions(
  route: RouteProp<ParamListBase, string>,
  mainScreenName: string,
  title: string,
  iconName: keyof typeof Ionicons.glyphMap
) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? mainScreenName;
  const isMainScreen = routeName === mainScreenName;

  return {
    drawerIcon: ({ color, size }: { color: string; size: number }) => (
      <Ionicons name={iconName} color={color} size={size} />
    ),
    headerShown: isMainScreen,
    headerStyle: { backgroundColor: "#ff8b32" },
    headerTintColor: "white",
    headerTitle: title,
  };
}

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props: DrawerContentComponentProps) => (
        <CustomDrawer {...props} />
      )}
      screenOptions={{
        drawerType: "slide",
        drawerStyle: { backgroundColor: "white" },
        drawerActiveBackgroundColor: "rgba(247, 176, 106, 0.16)",
        drawerItemStyle: { borderRadius: 6, width: "100%" },
        drawerLabelStyle: { color: "#ff8b32", fontSize: 16, fontWeight: "500" },
        drawerActiveTintColor: "#ff8b32",
        drawerInactiveTintColor: "rgba(142, 119, 99, 0.7)",
      }}
    >
      {/* Pantalla normal (sin stack) */}
      <Drawer.Screen
        name="Tracker Map"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="boat" color={color} size={size} />
          ),
          headerStyle: { backgroundColor: "#ff8b32" },
          headerTintColor: "white",
          headerTitle: "Tracker Map",
        }}
      />

      {/* Pantalla normal (sin stack) */}
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
          headerStyle: { backgroundColor: "#ff8b32" },
          headerTintColor: "white",
          headerTitle: "Settings",
        }}
      />

      {/* Stack con detección automática */}
      <Drawer.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={({ route }: { route: RouteProp<ParamListBase, string> }) =>
          getDrawerScreenOptions(route, "ProfileMain", "Profile", "person")
        }
      />

      {/* Ejemplo: si mañana agregas otro stack */}
      {/*
      <Drawer.Screen
        name="Orders"
        component={OrdersStackNavigator}
        options={({ route }) =>
          getDrawerScreenOptions(route, "OrdersMain", "Orders", "list")
        }
      />
      */}
    </Drawer.Navigator>
  );
}
