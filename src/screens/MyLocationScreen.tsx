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
import axios from "axios";

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
  const { theme, typography } = useTheme();
  const moveCameraScreen = () => {
    navigation.navigate("Camera");
  };
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
    <View style={styles.container}>
      <View style={styles.map}>
        <MapScreen />
      </View>
      {!openSearchBar && (
        <View style={styles.info}>
          <Text style={[typography.header]}>
            <AntDesign name="sound" size={24} color="black" />
            출발 위치는
          </Text>
          <Text
            style={[
              typography.header,
              {
                color: theme.colors.emphasis,
                marginLeft: 25,
                fontFamily: theme.fonts.NotoSansKR.bold,
              },
            ]}
          >
            출발위치 좌표로 장소명 뽑아내서 여기다가 작성하기
          </Text>
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
        <TouchableOpacity onPress={moveCameraScreen}>
          <Text style={[typography.header, styles.optionText]}>
            <AntDesign
              name="camerao"
              size={24}
              color={theme.colors.text.secondary}
            />
            사진 찍기
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
