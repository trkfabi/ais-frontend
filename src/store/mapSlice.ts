import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapState {
  latitude: number;
  longitude: number;
  zoom: number;
}

const initialState: MapState = {
  latitude: 40.6464364, // NY Harbor
  longitude: -74.0999962,
  zoom: 12,
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
      console.log(action.payload);
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.zoom = action.payload.zoom;
    },
  },
});

export const { setMapView } = mapSlice.actions;
export default mapSlice.reducer;
