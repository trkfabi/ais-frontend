import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ForecastScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Weather Forecast</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "bold" },
});
