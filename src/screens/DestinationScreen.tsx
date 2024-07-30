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

const DestinationScreen: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null
  );

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
            query: "세종문화회관", // 음성 || 검색으로 전달받은 장소 키워드
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
  }, []);

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
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  item: {
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DestinationScreen;
