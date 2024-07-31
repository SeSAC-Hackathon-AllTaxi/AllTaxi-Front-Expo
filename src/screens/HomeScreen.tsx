import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "contexts/ThemeContext";
import { theme } from "constants/theme";
import MapView from "react-native-maps";
import MapScreen from "./MapScreen";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { GOOGLE_API_KEY } from "@env";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

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
  const { theme, typography } = useTheme();
  const moveChatScreen = () => {
    navigation.navigate("Chat");
  };
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const searchInputRef = useRef<GooglePlacesAutocomplete>(null);

  const handlePlaceSelect = (data: any, details: any) => {
    // console.log("data ", data);
    // console.log("test", data.terms[0].value);

    navigation.navigate("Destination", { destination: data.terms[0].value });
    // 검색창 초기화
    searchInputRef.current?.setAddressText("");
    setOpenSearchBar(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <MapScreen />
      </View>
      {!openSearchBar && (
        <View style={styles.info}>
          <Text style={styles.infoText}>
            <AntDesign name="sound" size={24} color="black" />
            안녕하세요,
          </Text>
          <Text style={[typography.header]}>어디로 가고 싶으세요?</Text>
        </View>
      )}
      {openSearchBar && (
        <View style={styles.inputContainer}>
          <GooglePlacesAutocomplete
            ref={searchInputRef}
            minLength={2}
            placeholder="장소를 검색해보세요!"
            query={{
              key: GOOGLE_API_KEY,
              language: "ko",
              components: "country:kr",
            }}
            keyboardShouldPersistTaps={"handled"}
            fetchDetails={true}
            onPress={handlePlaceSelect}
            onFail={(error) => console.log(error)}
            onNotFound={() => console.log("no results")}
            keepResultsAfterBlur={true}
            enablePoweredByContainer={false}
          />
        </View>
      )}
      <View style={styles.option}>
        <TouchableOpacity onPress={() => setOpenSearchBar(true)}>
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
