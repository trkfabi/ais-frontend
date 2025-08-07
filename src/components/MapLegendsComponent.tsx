import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export type LayerKey =
  | "clouds_new"
  | "precipitation_new"
  | "temp_new"
  | "wind_new"
  | "pressure_new"
  | "waves_new";

// Exact OWM color stops (left to right)
const layerLegends: Record<LayerKey, { colors: string[]; labels: string[] }> = {
  clouds_new: {
    colors: ["#f0f8ff", "#cccccc", "#999999", "#666666", "#333333"],
    labels: ["0%", "25%", "50%", "75%", "100%"],
  },
  precipitation_new: {
    colors: ["#e0f7ff", "#99e2ff", "#33c0ff", "#0074d9", "#ff5500", "#ff1100"],
    labels: ["0mm", "1mm", "5mm", "10mm", "20mm", "50mm"],
  },
  temp_new: {
    colors: ["#2e00ff", "#00bfff", "#00ff00", "#ffff00", "#ff7f00", "#ff0000"],
    labels: ["-40°C", "-10°C", "0°C", "20°C", "30°C", "40°C"],
  },
  wind_new: {
    colors: ["#e0e0e0", "#99ff99", "#ffff00", "#ff7f00", "#ff0000"],
    labels: ["0 m/s", "5 m/s", "10 m/s", "20 m/s", "30 m/s"],
  },
  pressure_new: {
    colors: ["#0000ff", "#00ffff", "#00ff00", "#ffff00", "#ff0000"],
    labels: ["980hPa", "1000hPa", "1015hPa", "1030hPa", "1050hPa"],
  },
  waves_new: {
    colors: ["#0000ff", "#00ffff", "#00ff00", "#ffff00", "#ff0000"],
    labels: ["0 m", "0.5 m", "1 m", "3 m", "5 m"],
  },
};

interface Props {
  activeLayer: LayerKey | null;
}

const MapLegendsComponent: React.FC<Props> = ({ activeLayer }) => {
  if (!activeLayer || !layerLegends[activeLayer]) return null;
  const { colors, labels } = layerLegends[activeLayer];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors as [string, string, ...string[]]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      />
      <View style={styles.labels}>
        {labels.map((label, index) => (
          <Text key={index} style={styles.label}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 5,
    borderRadius: 6,
  },
  gradient: {
    height: 10,
    borderRadius: 4,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  label: {
    fontSize: 10,
    color: "#333",
  },
});

export default MapLegendsComponent;
