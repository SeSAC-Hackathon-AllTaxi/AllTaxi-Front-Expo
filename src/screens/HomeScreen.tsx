import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "contexts/ThemeContext";
import { theme } from "constants/theme";
import MapScreen from "./MapScreen";
import { AntDesign } from "@expo/vector-icons";
import SpeakButton from "components/SpeekButton";

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Destination: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const { typography } = useTheme();
  const moveChatScreen = () => {
    navigation.navigate("Chat");
  };

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <MapScreen />
      </View>

      <View style={styles.info}>
        <Text style={[typography.header]}>
          <AntDesign name="sound" size={32} color="black" />
          {"  "}
          어디로 갈까요?
        </Text>
      </View>
      <TouchableOpacity onPress={moveChatScreen}>
        <SpeakButton />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    backgroundColor: "black",
  },
  inputContainer: {
    zIndex: 1,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  info: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: theme.colors.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoText: {
    color: theme.colors.text.secondary,
    fontSize: 18,
  },
  optionText: {
    color: theme.colors.text.secondary,
  },

  option: {
    justifyContent: "center",
    alignItems: "center",
    height: 130,
    position: "absolute",
    bottom: 70,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    zIndex: 1,
  },
  content: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: theme.colors.background,
    marginTop: 5,
    fontWeight: 600,
  },
});
