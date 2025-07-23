import { Vessel, Vessels, Bounds } from "../config/types";

import { fixBoundsOrder, getUTCMinutesAgo } from "../utils/Conversion";
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.14:3000/api/";

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
  //console.log(apiUrl);
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch vessels");
  }
  const data: Vessels = await response.json();

  return data.results;
};
