export type Vessel = {
  mmsi: number;
  cog: number;
  sog: number;
  latitude: number;
  longitude: number;
  shipName: string;
  trueHeading: number;
};
export type Vessels = {
  success: Boolean;
  message: String;
  results: Vessel[];
};
export type Bounds = { ne: GeoJSON.Position; sw: GeoJSON.Position } | null;
