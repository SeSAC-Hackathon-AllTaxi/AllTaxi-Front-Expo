import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Alert } from "react-native";
import { KAKAO_REST_API_KEY } from "@env";
import { theme } from "constants/theme";
import { useTheme } from "contexts/ThemeContext";
import { FontAwesome, Ionicons, AntDesign } from "@expo/vector-icons";
import MapScreen from "screens/MapScreen";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { calculateTaxiFare } from "utils/calculateTaxiFare";

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  MyLocation: { requestId: number }; // MyLocation에 requestId 전달
  Destination: { destination: string } | undefined;
  DestinationDetail: { place: Object; onBack: () => void };
  TaxiMatchScreen: { requestId: number };
};

interface DestinationListItemProps {
  place: {
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
  };
  onBack: () => void;
}

interface IAddressItem {
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
  };
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
  };
}
interface IAddress extends Array<IAddressItem> {}

const DestinationListItem: React.FC<DestinationListItemProps> = ({
  place,
  onBack,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [address, setAddress] = useState<IAddress | undefined>();
  const { theme, typography } = useTheme();
  const [openModal, setOpenModal] = useState(false);

  const searchCoord = async () => {
    try {
      const response = await axios.get(
        "https://dapi.kakao.com/v2/local/geo/coord2address.json",
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
          },
          params: {
            x: place.x,
            y: place.y,
          },
        }
      );

      setAddress(response.data.documents);
    } catch (error) {
      console.error("Error searching Coord:", error);
    }
  };

  useEffect(() => {
    searchCoord();
  }, []);

  const distanceInMeters = Number(place.distance);
  const isNightTime = false; // 주간 시간대
  const result = calculateTaxiFare(distanceInMeters, isNightTime);

  const sendDestination = async () => {
    try {
      const response = await axios.post("http://3.34.131.133:8080/api/create-request", {
        userId: 2,
        placeName: place.place_name,
        address: place.address_name,
        latitude: parseFloat(place.y),
        longitude: parseFloat(place.x),
      });
      console.log("Response from backend:", response.data);
      const requestId = response.data.requestId;
      navigation.navigate('MyLocation', { requestId });

    } catch (error) {
      console.error("Error sending destination:", error);
      Alert.alert("Error", "Failed to send destination.");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
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
        }}
      >
        <AntDesign name="sound" size={32} color="black" />
        <Text style={[typography.header, { marginLeft: 5 }]}>
          <Text style={{ color: theme.colors.primary, fontWeight: 600 }}>
            {place.place_name}
          </Text>
          (으)로 가겠습니다.
        </Text>
      </View>
      <View style={styles.img}>
        <MapScreen x={place.x} y={place.y} />
      </View>
      <View style={styles.info}>
        <Text style={styles.infoText}>
          <Ionicons
            name="location-sharp"
            size={23}
            color={theme.colors.text.secondary}
          />
          {place.address_name}
        </Text>
        <Text style={styles.title}>
          {place.place_name} {"\n"}
          소요 시간: {result.estimatedTime}분 {"\n"}
          예상 금액: {result.fare}원
        </Text>
      </View>

      <View style={styles.alter}>
        <TouchableWithoutFeedback
          onPress={sendDestination}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>여기로 출발</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={onBack}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>다른 장소로</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  redoIcon: {
    marginTop: 50,
    position: "absolute",
    zIndex: 1,
    fontSize: 30,
    color: theme.colors.background,
    marginLeft: 10,
  },
  arrowIcon: {
    position: "absolute",
    bottom: -20,
    right: 10,
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  img: {
    flex: 1.3,
    backgroundColor: theme.colors.text.secondary,
  },
  info: {
    flex: 0.7,
    padding: 10,
  },
  infoText: {
    color: theme.colors.text.secondary,
    fontSize: 23,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 27,
    marginTop: 15,
    marginBottom: 5,
    fontFamily: theme.fonts.NotoSansKR.bold,
  },
  alter: {
    flex: 0.5,
    backgroundColor: theme.colors.background,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  alterText: {
    padding: 10,
    fontSize: 25,
    fontFamily: theme.fonts.NotoSansKR.thin,
    color: theme.colors.primary,
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
    height: 80,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 30,
    margin: "auto",
    borderRadius: 10,
    fontFamily: theme.fonts.NotoSansKR.bold,
  },
});

export default DestinationListItem;
