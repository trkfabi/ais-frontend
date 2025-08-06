import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapState {
  latitude: number;
  longitude: number;
  zoom: number;
  activeLayer: string | null;
}

const initialState: MapState = {
  latitude: 40.6464364, // NY Harbor
  longitude: -74.0999962,
  zoom: 12,
  activeLayer: null,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapView: (
      state,
      action: PayloadAction<{
        latitude: number;
        longitude: number;
        zoom: number;
      }>
    ) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.zoom = action.payload.zoom;
    },
    setActiveLayer(state, action: PayloadAction<string | null>) {
      state.activeLayer = action.payload;
    },
  },
});

export const { setMapView, setActiveLayer } = mapSlice.actions;
export default mapSlice.reducer;
