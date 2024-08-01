import { theme } from "constants/theme";
import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "contexts/ThemeContext";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import axios from "axios";
import { GOOGLE_API_KEY } from "@env";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Destination: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function SearchBar() {
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const searchInputRef = useRef<GooglePlacesAutocomplete>(null);

  const handlePlaceSelect = (data: any, details: any) => {
    // 1) kakao map api를 사용하여 목적지 상세 페이지 구현
    // navigation.navigate("Destination", { destination: data.terms[0].value });

    // 2) google map api를 사용하여 목적지 상세 페이지 구현
    if (details) {
      const apiRes = axios
        .get("https://maps.googleapis.com/maps/api/place/photo", {
          params: {
            photoreference: details.photos[0].photo_reference,
            maxwidth: 400,
            key: GOOGLE_API_KEY,
          },
          responseType: "arraybuffer",
        })
        .then((res) => {
          navigation.navigate("DestinationDetail", {
            data: data,
            details: details,
            img: res.request.responseURL,
          });
        });
    }

    // 검색창 초기화
    searchInputRef.current?.setAddressText("");
    setOpenSearchBar(false);
  };
  return (
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
  );
}

const styles = StyleSheet.create({
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
});
