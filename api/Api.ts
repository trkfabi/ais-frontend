import { Vessel, Vessels, Bounds } from "../config/types";

import { fixBoundsOrder, getUTCMinutesAgo } from "../utils/Conversion";
import Constants from "expo-constants";
import * as Device from "expo-device";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/";

export const fetchVessels = async (
  actualBounds: Bounds = null,
  minutesAgo: number = 2
): Promise<Vessel[]> => {
  const correctedBounds = fixBoundsOrder(actualBounds);
  const timeUtc = getUTCMinutesAgo(minutesAgo);
  let apiUrl = `${BASE_URL}vessels?minutes_ago=${minutesAgo}&timeUtc=${timeUtc}`;
  if (actualBounds) {
    apiUrl += `&bounds=${JSON.stringify(correctedBounds)}`;
  }
  // Get a unique device identifier
  // const deviceId =
  //   Constants?.installationId || Constants?.deviceId || "unknown-device";

  const deviceId = Device.osInternalBuildId || Device.deviceName || "unknown";
  const response = await fetch(apiUrl, {
    headers: {
      "x-device-id": deviceId,
    },
  });
  console.log("Fetching vessels from:", apiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch vessels");
  }
  const data: Vessels = await response.json();

  return data.results;
};
