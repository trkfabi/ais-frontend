import React, { useEffect, useRef, useState } from "react";
import MapboxGL from "@rnmapbox/maps";
import { StyleSheet, View, PermissionsAndroid, Platform } from "react-native";
// @ts-ignore: Ignore missing module for environment variable import
import { EXPO_PUBLIC_MAPBOX_PK, EXPO_PUBLIC_OPENWEATHER_API_KEY } from "@env";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useFocusEffect } from "@react-navigation/native";
import type { Camera } from "@rnmapbox/maps";

MapboxGL.setAccessToken(EXPO_PUBLIC_MAPBOX_PK);

export default function ForecastScreen() {
  const cameraRef = useRef<Camera>(null);
  const { latitude, longitude, zoom } = useSelector(
    (state: RootState) => state.map
  );

  // Cuando el tab Forecast se enfoca, mover la cámara
  useFocusEffect(
    React.useCallback(() => {
      if (cameraRef.current) {
        console.log("Reposicionando Forecast a:", latitude, longitude, zoom);
        cameraRef.current.setCamera({
          centerCoordinate: [longitude, latitude],
          zoomLevel: zoom,
          animationDuration: 1000,
        });
      }
    }, [latitude, longitude, zoom])
  );

  const [frames, setFrames] = useState<any[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);

  const openWeatherKey = EXPO_PUBLIC_OPENWEATHER_API_KEY;

  // 📌 Cargar frames de lluvia RainViewer
  useEffect(() => {
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((res) => res.json())
      .then((data) => {
        if (data?.radar?.past?.length) {
          setFrames(data.radar.past);
        }
      })
      .catch((err) => console.error("Error cargando RainViewer", err));
  }, []);

  // 📌 Animación
  useEffect(() => {
    if (!frames.length) return;
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 500);
    return () => clearInterval(interval);
  }, [frames]);

  // URL de tiles
  const radarTile =
    frames.length > 0
      ? `https://tilecache.rainviewer.com/v2/radar/${frames[frameIndex].time}/256/{z}/{x}/{y}/2/1_1.png`
      : null;

  const windTile = `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${openWeatherKey}`;

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={zoom}
          centerCoordinate={[longitude, latitude]}
        />

        {/* 📍 Lluvia */}
        {radarTile && (
          <MapboxGL.RasterSource
            id="radar"
            tileUrlTemplates={[radarTile]}
            tileSize={256}
          >
            <MapboxGL.RasterLayer
              id="radarLayer"
              sourceID="radar"
              style={{ rasterOpacity: 0.7 }}
            />
          </MapboxGL.RasterSource>
        )}

        {/* 🌬 Viento */}
        <MapboxGL.RasterSource
          id="wind"
          tileUrlTemplates={[windTile]}
          tileSize={256}
        >
          <MapboxGL.RasterLayer
            id="windLayer"
            sourceID="wind"
            style={{ rasterOpacity: 0.5 }}
          />
        </MapboxGL.RasterSource>
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
