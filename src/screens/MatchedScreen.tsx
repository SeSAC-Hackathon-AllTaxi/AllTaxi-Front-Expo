import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "contexts/ThemeContext";
import { theme } from "constants/theme";
import axios from 'axios';
import MapScreen from "./MapScreen";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRoute, RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Destination: { destination: string };
  TaxiMatch: { requestId: number };
};

type MatchedScreenRouteProp = RouteProp<RootStackParamList, "TaxiMatch">;

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "TaxiMatch">;
};

const MatchedScreen: React.FC<Props> = ({ navigation }) => {
  const { typography } = useTheme();
  const route = useRoute<MatchedScreenRouteProp>();
  const { requestId } = route.params;
  const [driverInfo, setDriverInfo] = useState(null);
  const [routeInfo, setRouteInfo] = useState({
    startLocation: { x: 0, y: 0 },
    endLocation: { x: 0, y: 0 }
  });

  useEffect(() => {
    const fetchDriverInfo = async () => {
      try {
        const response = await axios.post(`http://3.34.131.133:8080/api/match-taxi/${requestId}`);
        setDriverInfo(response.data);
        setRouteInfo({
          startLocation: { x: response.data.pickupLocation.split(",")[1], y: response.data.pickupLocation.split(",")[0] },
          endLocation: { x: response.data.destinationLocation.split(",")[1], y: response.data.destinationLocation.split(",")[0] },
        });
      } catch (error) {
        console.error("Error fetching driver info:", error);
      }
    };

    fetchDriverInfo();
  }, [requestId]);

  return (
    <View style={styles.container}>
      {driverInfo && (
        <View style={styles.info}>
          <Image source={{ uri: 'https://all-taxi.s3.ap-northeast-2.amazonaws.com/27f6c2d9a8e42c2dfc38fb6e117c2f80.jpeg' }} style={styles.driverImage} />
          <View style={styles.driverTextContainer}>
            <Text style={styles.infoText}>
              차번호 {driverInfo.driverCarNumber},{"\n"}
              {driverInfo.driverName} 기사님이{"\n"}
              7분 후 도착해요
            </Text>
          </View>
        </View>
      )}
      <View style={styles.map}>
        <MapScreen startLocation={routeInfo.startLocation} endLocation={routeInfo.endLocation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    backgroundColor: "black",
  },
  info: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 290,
    backgroundColor: theme.colors.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  driverTextContainer: {
    marginTop: 10,
    alignItems: "center",
    width: 315,
    height: 203,
    justifyContent: "center",
  },
  infoText: {
    color: theme.colors.text.secondary,
    fontSize: 28,
    color: "#000",
    textAlign: "center",
    bottom: -20,
  },
  driverImage: {
    bottom: -60,
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: '#FFF',
    backgroundColor: 'lightgray',
    resizeMode: 'cover',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.33,
    shadowRadius: 32,
  },
});

export default MatchedScreen;
