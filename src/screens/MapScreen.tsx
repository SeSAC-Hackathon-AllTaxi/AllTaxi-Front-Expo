import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import axios from "axios";
import { useLocationStore } from "state/locationStore";
import { GOOGLE_MAPS_iOS_API_KEY } from "@env";

// 폴리라인 디코딩 함수
function decodePolyline(
  encoded: string
): { latitude: number; longitude: number }[] {
  const poly = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    poly.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return poly;
}

interface MapScreenProps {
  x?: string;
  y?: string;
}

const MapScreen: React.FC<MapScreenProps> = ({ x, y }) => {
  const location = useLocationStore.getState().location;
  const [origin, setOrigin] = useState({
    latitude: location?.coords?.latitude ?? 37.5665,
    longitude: location?.coords?.longitude ?? 126.978,
  });

  const [destination, setDestination] = useState({
    latitude: Number(y) || 0,
    longitude: Number(x) || 0,
  });
  const [route, setRoute] = useState<
    { latitude: number; longitude: number }[] | null
  >(null);

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
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_iOS_API_KEY}`;

      console.log("Fetching route from URL:", url); // URL 로깅

      const response = await axios.get(url);

      console.log("API Response:", JSON.stringify(response.data, null, 2)); // 전체 응답 로깅

      if (response.data.status !== "OK") {
        throw new Error(`API returned status: ${response.data.status}`);
      }

      if (!response.data.routes || response.data.routes.length === 0) {
        throw new Error("No routes found");
      }

      const route = response.data.routes[0];
      if (!route.overview_polyline || !route.overview_polyline.points) {
        throw new Error("No polyline found in the route");
      }

      const points = route.overview_polyline.points;
      const decodedPoints = decodePolyline(points);
      setRoute(decodedPoints);
    } catch (error) {
      console.error("Error fetching route:", error);
      alert("경로를 가져오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

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
        {route && (
          <Polyline
            coordinates={route}
            strokeWidth={4}
            strokeColor="rgba(0, 120, 255, 0.7)"
          />
        )}
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
