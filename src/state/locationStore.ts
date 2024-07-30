import { create } from "zustand";
import * as Location from "expo-location";

interface LocationState {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  fetchLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  errorMsg: null,
  fetchLocation: async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        set({ errorMsg: "Permission to access location was denied" });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      set({ location, errorMsg: null });
    } catch (error) {
      set({ errorMsg: "Error fetching location" });
    }
  },
}));
