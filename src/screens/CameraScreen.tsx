import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "contexts/ThemeContext";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Destination: undefined;
  Camera: undefined;
};

type CameraScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Camera"
>;

type Props = {
  navigation: CameraScreenNavigationProp;
};

export default function CameraScreen({ navigation }: Props) {
  const { theme, typography } = useTheme();
  const [image, setImage] = useState<string | null>(null);

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("카메라 접근 권한이 필요합니다!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={[typography.header]}>
          <AntDesign name="sound" size={24} color="black" />
          지금 계신 위치를 찍어주세요
        </Text>
      </View>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>사진 촬영</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    zIndex: 1,
  },
  button: {
    position: "absolute",
    bottom: 15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    fontSize: 23,
    color: "white",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
