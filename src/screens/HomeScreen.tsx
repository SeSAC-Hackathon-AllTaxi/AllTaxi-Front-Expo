import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "contexts/ThemeContext";
import { theme } from "constants/theme";
import MapView from "react-native-maps";
import MapScreen from "./MapScreen";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const { theme, typography } = useTheme();
  const moveChatScreen = () => {
    navigation.navigate("Chat");
  };
  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <MapScreen />
      </View>
      <View style={styles.info}>
        <Text style={styles.infoText}>
          <AntDesign name="sound" size={24} color="black" />
          안녕하세요,
        </Text>
        <Text style={[typography.header]}>어디로 가고 싶으세요?</Text>
      </View>
      <View style={styles.option}>
        <TouchableOpacity onPress={() => console.log("click search")}>
          <Text style={[typography.header, styles.optionText]}>
            <AntDesign
              name="search1"
              size={24}
              color={theme.colors.text.secondary}
            />
            검색하기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={moveChatScreen}>
          <Text style={[typography.header, styles.optionText]}>
            <FontAwesome5
              name="microphone"
              size={24}
              color={theme.colors.text.secondary}
            />
            음성으로 말하기
          </Text>
        </TouchableOpacity>
      </View>
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
  info: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: theme.colors.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    zIndex: 1,
    opacity: 0.9,
  },
  infoText: {
    color: theme.colors.text.secondary,
    fontSize: 18,
  },
  option: {
    height: 130,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.background,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
    opacity: 0.9,
  },
  optionText: {
    color: theme.colors.text.secondary,
  },
});
