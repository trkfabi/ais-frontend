import "react-native-gesture-handler";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider } from "react-redux";
import { store } from "./src/store";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <AppNavigator />
      </QueryClientProvider>
    </Provider>
  );
}

export default gestureHandlerRootHOC(App);
