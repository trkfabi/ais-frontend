import { Vessel, Vessels, Bounds } from "../config/types";

export const boundsToPolygon = (
  bounds: Bounds
): GeoJSON.Feature<GeoJSON.Polygon> => {
  if (!bounds) {
    throw new Error("Bounds cannot be null");
  }
  const minLng = bounds.sw[0];
  const minLat = bounds.sw[1];
  const maxLng = bounds.ne[0];
  const maxLat = bounds.ne[1];
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [minLng, minLat],
          [minLng, maxLat],
          [maxLng, maxLat],
          [maxLng, minLat],
          [minLng, minLat], // Cerrando el polígono
        ],
      ],
    },
    properties: {},
  };
};

export const fixBoundsOrder = (bounds: Bounds): Bounds => {
  if (!bounds) return null;

  const { ne, sw } = bounds;
  return {
    ne: [ne[1], ne[0]], // Switch lat and lng
    sw: [sw[1], sw[0]], // Switch lat and lng
  };
};

export const getUTCMinutesAgo = (minutesAgo: number): string => {
  const now = new Date(); // Fecha y hora actual
  const utcTime = new Date(now.getTime() - minutesAgo * 60 * 1000); // Restar minutos en milisegundos
  return utcTime.toISOString(); // Convertir a formato UTC
};

export const interpolateColor = (
  color1: string,
  color2: string,
  ratio: number
): string => {
  const hex = (color: string) => color.replace("#", "");

  const r = (hex: string) => parseInt(hex.substring(0, 2), 16);
  const g = (hex: string) => parseInt(hex.substring(2, 4), 16);
  const b = (hex: string) => parseInt(hex.substring(4, 6), 16);

  const c1 = hex(color1);
  const c2 = hex(color2);

  const red = Math.round(r(c1) + (r(c2) - r(c1)) * ratio);
  const green = Math.round(g(c1) + (g(c2) - g(c1)) * ratio);
  const blue = Math.round(b(c1) + (b(c2) - b(c1)) * ratio);

  return (
    "#" +
    [red, green, blue].map((val) => val.toString(16).padStart(2, "0")).join("")
  );
};
