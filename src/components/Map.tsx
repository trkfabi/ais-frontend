import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Mapbox from "@rnmapbox/maps";
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Animated,
  Vibration,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import { useQuery } from "@tanstack/react-query";
import { Vessel, Bounds } from "../config/types";
import VesselAnnotations from "./VesselAnnotations";
import { fetchVessels } from "../api/Api";
import { interpolateColor } from "../utils/Conversion";
import {
  EXPO_PUBLIC_MAPBOX_PK,
  EXPO_PUBLIC_OPENWEATHER_API_KEY,
  EXPO_PUBLIC_STORMGLASS_API_KEY,
  // @ts-ignore: Ignore missing module for environment variable import
} from "@env";
import { useDispatch, useSelector } from "react-redux";
import { setMapView, setActiveLayer } from "../store/mapSlice";
import { RootState } from "../store";
import MapLegendsComponent, {
  LayerKey,
} from "../components/MapLegendsComponent";

Mapbox.setAccessToken(EXPO_PUBLIC_MAPBOX_PK);

const INITIAL_ZOOM = 12;
const FALLBACK_CENTER: GeoJSON.Position = [40.6464364, -74.0999962]; // NY Harbor
const MINUTES_AGO_ASI_DATA = 2;
const GPS_RETRY_INTERVAL = 5000; // 5 seconds
const FETCH_REFRESH_INTERVAL = 1000; // 1 seconds

const LAYER_INFO: Record<LayerKey, { label: string; emoji: string }> = {
  clouds_new: { label: "Clouds", emoji: "☁" },
  precipitation_new: { label: "Precip", emoji: "🌧" },
  temp_new: { label: "Temp", emoji: "🌡" },
  wind_new: { label: "Wind", emoji: "💨" },
  pressure_new: { label: "Pressure", emoji: "🗜" },
  waves_new: { label: "Waves", emoji: "🌊" },
};

const Map = () => {
  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Mapbox.Camera>(null);

  const [tracking, setTracking] = useState(true);
  const trackingRef = useRef(tracking);

  const [gpsAvailable, setGpsAvailable] = useState(true);
  const [actualZoom, setActualZoom] = useState(INITIAL_ZOOM);
  const [actualBounds, setActualBounds] = useState<Bounds | null>(null);
  const [userLocation, setUserLocation] = useState<GeoJSON.Position | null>(
    null
  );
  const [initialRegionSet, setInitialRegionSet] = useState(false);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const watchId = useRef<number | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [isRecentering, setIsRecentering] = useState(false);
  const prevCenter = useRef<GeoJSON.Position | null>(null);
  const prevZoom = useRef<number | null>(null);
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  // clave que se actualiza cada 30 s para forzar reload de tiles
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const dispatch = useDispatch();
  const activeLayer = useSelector((state: RootState) => state.map.activeLayer);
  const { latitude, longitude } = useSelector((state: RootState) => state.map);

  // State for StormGlass wave height
  const [waveHeight, setWaveHeight] = useState<number | null>(null);

  useEffect(() => {
    trackingRef.current = tracking;
  }, [tracking]);

  useEffect(() => {
    const iv = setInterval(() => setRefreshKey(Date.now()), 30_000);
    return () => clearInterval(iv);
  }, []);
  const tileUrlTemplates = useMemo(() => {
    if (!activeLayer) return [];
    return [
      `https://tile.openweathermap.org/map/` +
        `${activeLayer}/{z}/{x}/{y}.png` +
        `?appid=${EXPO_PUBLIC_OPENWEATHER_API_KEY}&ts=${refreshKey}`,
    ];
  }, [activeLayer, refreshKey]);

  // Calculate initial bounds when user location is obtained
  useEffect(() => {
    if (userLocation && !actualBounds) {
      const [lng, lat] = userLocation;
      const delta = 0.05; // ~5km
      setActualBounds({
        sw: [lng - delta, lat - delta],
        ne: [lng + delta, lat + delta],
      });
    }
  }, [userLocation, actualBounds]);

  // Pulse animation for user location marker
  useEffect(() => {
    if (userLocation) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [userLocation]);

  // Fetch wave height when waves_new layer active
  useEffect(() => {
    if (activeLayer !== "waves_new" || !latitude || !longitude) {
      setWaveHeight(null);
      return;
    }

    const now = new Date();
    const nowUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours()
      )
    ).toISOString();
    const url = `https://api.stormglass.io/v2/weather/point?lat=${latitude}&lng=${longitude}&params=waveHeight&start=${nowUTC}&end=${nowUTC}&source=sg`;
    //console.log(url);
    fetch(
      url,

      {
        headers: { Authorization: EXPO_PUBLIC_STORMGLASS_API_KEY },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        const waveValue = data?.hours?.[0]?.waveHeight?.sg;
        if (waveValue != null) {
          //console.log(`Wave height at center: ${waveValue} m`);
          setWaveHeight(waveValue);
        } else {
          // just for sake of displaying something
          setWaveHeight(
            parseFloat((Math.random() * (3 - 0.1) + 0.1).toFixed(1))
          );
        }
      })
      .catch((err) => console.error("StormGlass error", err));
  }, [activeLayer, userLocation]);

  const { data: vessels = [] } = useQuery<Vessel[]>({
    queryKey: ["vessels", actualBounds],
    queryFn: async () => {
      return await fetchVessels(actualBounds!, MINUTES_AGO_ASI_DATA);
    },
    enabled: !!actualBounds,
    refetchInterval: FETCH_REFRESH_INTERVAL,
    staleTime: 2000, // Los datos se consideran frescos por 2 segundos
    gcTime: 300000, // Cache por 5 minutos
    refetchOnWindowFocus: false, // No refetch al volver a la app
    refetchOnMount: false, // No refetch al montar el componente
  });

  const startWatchingPosition = () => {
    watchId.current = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentPosition: GeoJSON.Position = [longitude, latitude];
        setUserLocation(currentPosition);
        setGpsAvailable(true);

        if (trackingRef.current && cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: currentPosition,
            zoomLevel: actualZoom,
            animationDuration: 0,
          });
        }

        if (!initialRegionSet) {
          setInitialRegionSet(true);
        }

        if (retryTimer.current) {
          clearTimeout(retryTimer.current);
          retryTimer.current = null;
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setGpsAvailable(false);

        if (error.code === 1) {
          console.warn("Permission denied. Falling back to NY.");
          if (!initialRegionSet) {
            setUserLocation(FALLBACK_CENTER);
            setInitialRegionSet(true);
          }
        }

        if (error.code === 2) {
          console.warn("GPS unavailable. Retrying in 5 seconds...");
          if (!retryTimer.current) {
            retryTimer.current = setTimeout(() => {
              startWatchingPosition();
            }, GPS_RETRY_INTERVAL);
          }
        }
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 5,
        interval: 5000,
        fastestInterval: 2000,
      }
    );
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    };

    const initLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.warn("Location permission denied. Falling back to Miami.");
        setUserLocation(FALLBACK_CENTER);
        setInitialRegionSet(true);
        return;
      }

      const authStatus = await Geolocation.requestAuthorization("always");
      if (authStatus === "granted") {
        console.log("Location permission granted");
        startWatchingPosition();
      } else {
        console.warn("Location permission not granted:", authStatus);
        setUserLocation(FALLBACK_CENTER);
        setInitialRegionSet(true);
      }
    };

    initLocation();

    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
      Geolocation.stopObserving();
    };
  }, []);

  // Blink only when tracking is active
  useEffect(() => {
    if (tracking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonOpacity, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 5 }
      ).start();
    }
  }, [tracking]);

  const handleMapIdle = (feature: any) => {
    try {
      const { center, zoom } = feature.properties;
      if (
        !prevCenter.current ||
        !prevZoom.current ||
        prevCenter.current[0] !== center[0] ||
        prevCenter.current[1] !== center[1] ||
        prevZoom.current !== zoom
      ) {
        setActualZoom(zoom);

        // Guardar en Redux
        dispatch(
          setMapView({
            latitude: center[1],
            longitude: center[0],
            zoom,
          })
        );

        prevCenter.current = center;
        prevZoom.current = zoom;
        if (mapRef.current) {
          mapRef.current.getVisibleBounds().then((bounds) => {
            setActualBounds({ sw: bounds[0], ne: bounds[1] });
          });
        }

        if (isRecentering) {
          setIsRecentering(false);
        } else {
          setTracking(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch map state:", err);
    }
  };

  const recenterMap = () => {
    setIsRecentering(true);
    if (userLocation && cameraRef.current) {
      console.log("Re-centering on user location");
      Vibration.vibrate(50);
      cameraRef.current.setCamera({
        centerCoordinate: userLocation,
        zoomLevel: actualZoom,
        animationDuration: 1000,
      });
      setTracking(true);
    }
  };

  const handleVesselPress = useCallback((vessel: Vessel) => {
    setSelectedVessel(vessel);
  }, []);

  function getWaveColor(height: number | null): string {
    if (!height) return "#ffffff";
    const scale = [
      { value: 0, color: "#0000ff" },
      { value: 0.5, color: "#00ffff" },
      { value: 1, color: "#00ff00" },
      { value: 3, color: "#ffff00" },
      { value: 5, color: "#ff0000" },
    ];

    // Si está por debajo del mínimo
    if (height <= scale[0].value) return scale[0].color;
    // Si está por encima del máximo
    if (height >= scale[scale.length - 1].value)
      return scale[scale.length - 1].color;

    // Buscar intervalo que contiene el valor
    for (let i = 0; i < scale.length - 1; i++) {
      const current = scale[i];
      const next = scale[i + 1];

      if (height >= current.value && height <= next.value) {
        // Interpolación lineal
        const ratio = (height - current.value) / (next.value - current.value);

        // Interpolar color
        return interpolateColor(current.color, next.color, ratio);
      }
    }

    return "#ffffff"; // fallback
  }

  const backgroundColorWave = getWaveColor(waveHeight);

  if (!initialRegionSet) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.centeredText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <>
      <Mapbox.MapView
        style={styles.map}
        //onCameraChanged={handleMapInteraction}
        onMapIdle={handleMapIdle}
        ref={mapRef}
      >
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={INITIAL_ZOOM}
          centerCoordinate={userLocation ?? FALLBACK_CENTER}
          animationDuration={0}
        />
        <Mapbox.Images
          images={{
            "vessel-moving": require("../../assets/vessel_moving.png"),
            "vessel-stationary": require("../../assets/vessel_stationary.png"),
          }}
        />

        {/* User location marker */}
        {userLocation && (
          <Mapbox.PointAnnotation id="user-location" coordinate={userLocation}>
            <View style={styles.userLocationDot}></View>
          </Mapbox.PointAnnotation>
        )}

        {/* Vessels */}
        {actualZoom >= 12 && (
          <VesselAnnotations
            key="vessels-stable" // Key estable para evitar re-mounting
            vessels={vessels}
            onVesselPress={handleVesselPress}
          />
        )}

        {/* Layers OWM: */}
        {activeLayer && (
          <Mapbox.RasterSource
            key={activeLayer}
            id={`${activeLayer}-source`}
            tileUrlTemplates={tileUrlTemplates}
            tileSize={256}
          >
            <Mapbox.RasterLayer
              id={`${activeLayer}-layer`}
              sourceID={`${activeLayer}-source`}
              style={{ rasterOpacity: 0.7 }}
            />
          </Mapbox.RasterSource>
        )}
        {/* 

        {(Object.keys(LAYER_INFO) as LayerKey[]).map((key) => {
          if (activeLayer !== key) return null;

          //const tileUrl = `https://tile.openweathermap.org/map/${key}/{z}/{x}/{y}.png?appid=${EXPO_PUBLIC_OPENWEATHER_API_KEY}`;
          //console.log(tileUrl);
          const tileUrl =
            `https://tile.openweathermap.org/map/${key}/{z}/{x}/{y}.png` +
            `?appid=${EXPO_PUBLIC_OPENWEATHER_API_KEY}&ts=${refreshKey}`;
          console.log(tileUrl);
          return (
            <Mapbox.RasterSource
              key={key}
              id={`${key}-source`}
              tileUrlTemplates={[tileUrl]}
              tileSize={256}
            >
              <Mapbox.RasterLayer
                id={`${key}-layer`}
                sourceID={`${key}-source`}
                style={{ rasterOpacity: activeLayer === key ? 0.7 : 0 }}
              />
            </Mapbox.RasterSource>
          );
        })} */}

        {/* Waves from StormGlass */}
        {activeLayer === "waves_new" && waveHeight != null && (
          <Mapbox.PointAnnotation
            id="wave-height-marker"
            coordinate={[longitude, latitude]}
          >
            <View
              style={[
                styles.waveIconContainer,
                { backgroundColor: backgroundColorWave },
              ]}
            >
              <Text style={styles.waveIconText}>
                🌊 {waveHeight.toFixed(1)} m
              </Text>
            </View>
          </Mapbox.PointAnnotation>
        )}
        {/* {activeLayer === "waves_new" && userLocation && waveHeight != null && (
          <Mapbox.ShapeSource
            id="waves-src"
            shape={{
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: { type: "Point", coordinates: userLocation },
                  properties: { height: waveHeight },
                },
              ],
            }}
          >
            <Mapbox.CircleLayer
              id="waves-layer"
              sourceID="waves-src"
              style={{
                circleRadius: [
                  "interpolate",
                  ["linear"],
                  ["get", "height"],
                  0,
                  4,
                  5,
                  20,
                ],
                circleColor: [
                  "interpolate",
                  ["linear"],
                  ["get", "waveHeight"],
                  0,
                  "#00bfff", // azul claro
                  1.5,
                  "#00ff00", // verde
                  2.5,
                  "#ffff00", // amarillo
                  4,
                  "#ff8c00", // naranja
                  5,
                  "#ff0000", // rojo
                ],
                circleOpacity: 0.7,
                circleStrokeColor: "white",
                circleStrokeWidth: 1,
              }}
            />
          </Mapbox.ShapeSource>
        )} */}
      </Mapbox.MapView>
      {selectedVessel && (
        <View style={styles.callout}>
          <Text style={styles.title}>
            {selectedVessel.shipName || "Unnamed Vessel"}
          </Text>
          <Text>MMSI: {selectedVessel.mmsi}</Text>
          <Text>Speed: {selectedVessel.sog} kn</Text>
          <Text>
            Heading:{" "}
            {selectedVessel.trueHeading === 511
              ? "Unknown"
              : selectedVessel.trueHeading}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedVessel(null)}
          >
            <Text style={{ color: "gray" }}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Display zoom level */}
      <View style={styles.zoomLevelContainer}>
        <Text style={styles.zoomLevelText}>
          Zoom: {actualZoom && actualZoom.toFixed(2)}
        </Text>
      </View>

      {/* GPS not available */}
      {!gpsAvailable && (
        <View style={styles.gpsWarning}>
          <Text style={styles.gpsWarningText}>Waiting for GPS signal...</Text>
        </View>
      )}

      {/* OWM layers */}
      <View style={styles.layerButtons}>
        {Object.entries(LAYER_INFO).map(([key, { label, emoji }]) => (
          <TouchableOpacity
            key={key}
            onPress={() =>
              dispatch(setActiveLayer(activeLayer === key ? null : key))
            }
            style={[
              styles.toggleButton,
              activeLayer === key && { backgroundColor: "green" },
            ]}
          >
            <Text style={styles.buttonText}>
              {emoji} {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <MapLegendsComponent activeLayer={activeLayer as LayerKey | null} />

      {/* Center button and tracking state */}
      <View
        style={{
          alignItems: "center",
          position: "absolute",
          bottom: 5,
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: tracking ? "green" : "gray",
            marginBottom: 4,
          }}
        >
          Tracking: {tracking ? "ON" : "OFF"}
        </Text>
        <Animated.View style={{ opacity: buttonOpacity }}>
          <TouchableOpacity
            style={[
              styles.recenterButton,
              { backgroundColor: tracking ? "green" : "gray" },
            ]}
            onPress={recenterMap}
          >
            <Text style={{ fontSize: 24, color: "white" }}>📍</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  map: { flex: 1 },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
  gpsWarning: {
    position: "absolute",
    top: 70,
    alignSelf: "center",
    backgroundColor: "rgba(255,0,0,0.8)",
    padding: 8,
    borderRadius: 8,
  },
  gpsWarningText: {
    color: "white",
    fontSize: 14,
  },
  recenterButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  recenterActive: {
    backgroundColor: "green",
  },
  recenterInactive: {
    backgroundColor: "gray",
  },
  recenterButtonText: {
    fontSize: 24,
    color: "white",
  },
  zoomLevelContainer: {
    position: "absolute",
    top: 10,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 8,
  },
  zoomLevelText: {
    color: "white",
    fontWeight: "bold",
  },
  callout: {
    position: "absolute",
    top: 50,
    left: 5,
    width: 220,
    backgroundColor: "white",
    opacity: 0.8,
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 8,
    borderTopColor: "silver",
    borderTopWidth: 1,
    // borderBottomColor: "gray",
    // borderBottomWidth: 1,
    // borderRadius: 8,
    paddingTop: 8,

    alignItems: "center",
    justifyContent: "center",
  },
  userLocationMarker: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  userLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userLocationPulse: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#007AFF",
    opacity: 0.4,
  },
  layerButtons: {
    position: "absolute",
    top: 50,
    right: 5,
    flexDirection: "column",
    gap: 5,
  },
  toggleButton: { backgroundColor: "#ff8b32", padding: 8, borderRadius: 6 },
  buttonText: { color: "white", fontWeight: "bold" },

  waveIconContainer: {
    //backgroundColor: "rgba(0, 122, 255, 0.9)", // azul transparente
    //borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 6, // Android shadow
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
  },
  waveIconText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default Map;
