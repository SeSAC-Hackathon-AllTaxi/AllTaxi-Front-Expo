import { useState, useEffect } from "react";
import * as Location from "expo-location";

interface LocationHook {
  location: Location.LocationObject | null;
  errorMsg: string | null;
}

export const useLocation = (): LocationHook => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return { location, errorMsg };
};
