import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { KAKAO_REST_API_KEY } from "@env";
import DestinationListItem from "components/destination/DestinationListItem";
import { useLocationStore } from "state/locationStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { typography } from "constants/typography";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "constants/theme";

interface SelectedPlace {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  place_url: string;
  distance: string;
}

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Destination: { destination: string } | undefined;
};

type DestinationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Destination"
>;

type DestinationScreenRouteProp = RouteProp<RootStackParamList, "Destination">;

type Props = {
  navigation: DestinationScreenNavigationProp;
  route: DestinationScreenRouteProp;
};

const DestinationScreen = ({ navigation, route }: Props) => {
  const [results, setResults] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null
  );
  const destination = route.params?.destination;

  const searchPlaces = async () => {
    try {
      const location = useLocationStore.getState().location;

      const response = await axios.get(
        "https://dapi.kakao.com/v2/local/search/keyword.json",
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
          },
          params: {
            query: destination, // 음성 || 검색으로 전달받은 장소 키워드
            x: location?.coords.longitude,
            y: location?.coords.latitude,
            size: 15, // 결과 수 제한 최대 15
          },
        }
      );
      setResults(response.data.documents);
    } catch (error) {
      console.error("Error searching places:", error);
    }
  };

  useEffect(() => {
    searchPlaces();
  }, [destination]);

  const handlePlaceSelect = (place: SelectedPlace) => {
    setSelectedPlace(place);
  };

  if (selectedPlace) {
    return (
      <DestinationListItem
        place={selectedPlace}
        onBack={() => setSelectedPlace(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <AntDesign name="sound" size={32} color="black" />
        <Text style={[typography.header, { marginLeft: 15 }]}>
          이 중에 어디인가요?
        </Text>
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePlaceSelect(item)}>
            <View style={styles.item}>
              <Text style={styles.title}>{item.place_name}</Text>
              <Text>{item.address_name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  info: {
    paddingTop: 80,
    height: 160,
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
  item: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DestinationScreen;
