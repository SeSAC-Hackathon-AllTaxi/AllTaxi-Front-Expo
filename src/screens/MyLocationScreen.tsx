import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "contexts/ThemeContext";
import { theme } from "constants/theme";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { typography } from "constants/typography";
import { Camera } from "expo-camera";
import CameraScreen from "./CameraScreen";

type RootStackParamList = {
  올택시: undefined;
  Booking: undefined;
  Destination: undefined;
  Chat: undefined;
  DestinationDetail: undefined;
  MyLocation: undefined;
  Camera: undefined;
};

type MyLocationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MyLocation"
>;

type Props = {
  navigation: MyLocationScreenNavigationProp;
};

export default function MyLocationScreen({ navigation }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState("back");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const toggleCameraType = () => {
    setType((current) => (current === "back" ? "front" : "back"));
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>카메라 접근 권한이 없습니다.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesign name="sound" size={32} color="black" />
        <Text style={[typography.header, { marginLeft: 5 }]}>
          지금 계신 출발지 사진을 찍어 주세요.
        </Text>
      </View>
      <View style={styles.cameraContainer}>
        <CameraScreen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    height: 200,
    paddingTop: 80,
    flex: 0.4,
    backgroundColor: theme.colors.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    zIndex: 1,
    display: "flex",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
