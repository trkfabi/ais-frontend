import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomeScreen from "./screens/HomeScreen";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <HomeScreen />
    </QueryClientProvider>
  );
};

export default App;
