import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
// @ts-ignore
import { EXPO_PUBLIC_OPENWEATHER_API_KEY } from "@env";

interface ForecastItem {
  dt: number;
  main: { temp: number };
  weather: [{ icon: string; description: string }];
  wind: { speed: number };
  rain?: { "3h": number };
  snow?: { "3h": number };
}

interface ForecastResponse {
  list: ForecastItem[];
  city?: { name: string };
}

export default function ForecastScreen() {
  const { latitude, longitude } = useSelector((state: RootState) => state.map);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!latitude || !longitude) return;

    async function fetchForecast() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${EXPO_PUBLIC_OPENWEATHER_API_KEY}`
        );
        const data: ForecastResponse = await res.json();
        if (res.ok) {
          setForecast(data);
        } else {
          console.error("Forecast error:", data);
        }
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff8b32" />
        <Text style={styles.loadingText}>Loading forecast data…</Text>
      </View>
    );
  }

  if (!forecast) {
    return (
      <View style={styles.center}>
        <Text>Unable to load forecast.</Text>
      </View>
    );
  }

  // Group forecast items by date (store timestamp at midnight)
  const groupedByDate: Record<string, ForecastItem[]> = {};
  forecast.list.forEach((item) => {
    const dateKey = new Date(item.dt * 1000).setHours(0, 0, 0, 0); // number
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(item);
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Forecast for {forecast.city?.name ?? "your location"}
      </Text>

      {Object.entries(groupedByDate).map(([dateKey, items], idx) => {
        const date = new Date(Number(dateKey));

        return (
          <View key={idx} style={styles.daySection}>
            <Text style={styles.dayHeader}>
              {date.toLocaleDateString([], {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </Text>
            {items.map((item, i) => {
              const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
              const precipitation = item.rain?.["3h"] || item.snow?.["3h"] || 0;

              return (
                <View key={i} style={styles.row}>
                  <Text style={styles.time}>
                    {new Date(item.dt * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Image source={{ uri: iconUrl }} style={styles.icon} />
                  <Text style={styles.temp}>
                    {Math.round(item.main.temp)}°C
                  </Text>
                  <Text style={styles.desc}>{item.weather[0].description}</Text>
                  <Text style={styles.metrics}>
                    💨 {item.wind.speed.toFixed(1)} m/s
                    {precipitation > 0 ? ` • ☔ ${precipitation} mm` : ""}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#ff8b32",
  },
  loadingText: { marginTop: 8, color: "#666" },
  daySection: { marginBottom: 16 },
  dayHeader: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#ff8b32",
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  time: { width: 60 },
  icon: { width: 40, height: 40, marginHorizontal: 4 },
  temp: { width: 50, fontWeight: "600", color: "#333" },
  desc: { flex: 1, textTransform: "capitalize", color: "#555" },
  metrics: { width: 110, fontSize: 12, color: "#444" },
});
