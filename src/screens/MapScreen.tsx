import MapView, { Polyline, Marker } from "react-native-maps";
import polyline from "@mapbox/polyline";
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import axios from "axios";
import { useLocationStore } from "state/locationStore";
import { NAVER_API_KEY, NAVER_API_KEY_ID } from "@env";
import { theme } from "constants/theme";

interface MapScreenProps {
  x?: string;
  y?: string;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

const MapScreen: React.FC<MapScreenProps> = ({ x, y }) => {
  const location = useLocationStore.getState().location;
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [origin, setOrigin] = useState<Coordinate>({
    latitude: location?.coords?.latitude ?? 37.5665,
    longitude: location?.coords?.longitude ?? 126.978,
  });
  const [destination, setDestination] = useState<Coordinate>({
    latitude: Number(y) || 0,
    longitude: Number(x) || 0,
  });

  useEffect(() => {
    if (x && y) {
      setDestination({
        latitude: Number(y),
        longitude: Number(x),
      });
      fetchRoute();
    }
  }, [x, y]);

  const fetchRoute = async () => {
    try {
      const url =
        "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving";
      const params = {
        start: `${origin.longitude},${origin.latitude}`,
        goal: `${destination.longitude},${destination.latitude}`,
        option: "trafast",
      };

      const headers = {
        "X-NCP-APIGW-API-KEY-ID": NAVER_API_KEY_ID,
        "X-NCP-APIGW-API-KEY": NAVER_API_KEY,
      };

      const response = await axios.get(url, { params, headers });

      if (response.data.code === 0) {
        const path = response.data.route.trafast[0].path;
        const coordinates: Coordinate[] = path.map((point: number[]) => ({
          latitude: point[1],
          longitude: point[0],
        }));
        setRouteCoordinates(coordinates);
      } else {
        throw new Error(`API returned code: ${response.data.code}`);
      }
    } catch (error) {
      // alert("경로를 가져오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
      console.error("Error fetching route:", error);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  const calculateDelta = (origin, destination) => {
    const latDelta = Math.abs(origin.latitude - destination.latitude) + 0.1;
    const lngDelta = Math.abs(origin.longitude - destination.longitude) + 0.1;
    return { latitudeDelta: latDelta, longitudeDelta: lngDelta };
  };

  const { latitudeDelta, longitudeDelta } =
    destination.latitude !== 0 && destination.longitude !== 0
      ? calculateDelta(origin, destination)
      : { latitudeDelta: 0.05, longitudeDelta: 0.05 };

  const initialRegion =
    destination.latitude !== 0 && destination.longitude !== 0
      ? {
          latitude: (origin.latitude + destination.latitude) / 2,
          longitude: (origin.longitude + destination.longitude) / 2,
          latitudeDelta,
          longitudeDelta,
        }
      : {
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta,
          longitudeDelta,
        };

  const calculateCenter = (origin, destination) => {
    return {
      latitude: (origin.latitude + destination.latitude) / 2,
      longitude: (origin.longitude + destination.longitude) / 2,
    };
  };

  const center =
    destination.latitude !== 0 && destination.longitude !== 0
      ? calculateCenter(origin, destination)
      : origin;

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {origin && !isNaN(origin.latitude) && !isNaN(origin.longitude) && (
          <Marker coordinate={origin} title="현위치: 현위치" pinColor="green" />
        )}
        {destination &&
          !isNaN(destination.latitude) &&
          !isNaN(destination.longitude) && (
            <Marker
              coordinate={destination}
              title="목적지: 목적지"
              pinColor="red"
            />
          )}
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={5}
          strokeColor={theme.colors.primary}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
