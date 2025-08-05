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
