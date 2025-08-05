import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./DrawerNavigator";

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
