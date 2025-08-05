import "react-native-gesture-handler";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <AppNavigator />
    </QueryClientProvider>
  );
}

export default gestureHandlerRootHOC(App);
