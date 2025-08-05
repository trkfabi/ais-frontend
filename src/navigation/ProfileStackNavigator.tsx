import React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import BillingHistoryScreen from "../screens/BillingHistoryScreen";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProfileStackParamList } from "./types";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BillingHistory"
        component={BillingHistoryScreen}
        options={({
          navigation,
        }: {
          navigation: NativeStackNavigationProp<
            ProfileStackParamList,
            "BillingHistory"
          >;
        }) => ({
          title: "Billing History",
          headerStyle: { backgroundColor: "#ff8b32" },
          headerTintColor: "white",
          headerLeft: () => (
            <TouchableOpacity
              style={{ paddingHorizontal: 10 }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
