import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
import { KAKAO_REST_API_KEY } from "@env";
import { theme } from "constants/theme";
import { useTheme } from "contexts/ThemeContext";
import {
  FontAwesome,
  Entypo,
  EvilIcons,
  Ionicons,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import MapScreen from "screens/MapScreen";

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
    region_3depth_name: string;
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
    region_3depth_name: string;
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

  return (
    <View style={styles.container}>
      <View style={styles.img}>
        <Text style={styles.redoIcon} onPress={onBack}>{`<`}</Text>
        <MapScreen x={place.x} y={place.y} />
        <TouchableOpacity
          style={styles.arrowIcon}
          onPress={() => setOpenModal(true)}
        >
          <FontAwesome5
            name="location-arrow"
            size={18}
            color={theme.colors.background}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        {/* <TouchableOpacity onPress={() => Linking.openURL(place.place_url)}> */}
        <Text style={styles.title}>{place.place_name}</Text>
        {/* </TouchableOpacity> */}
        <Text style={styles.infoText}>{place.category_name}</Text>

        <Text style={styles.infoText}>
          <Ionicons
            name="location-sharp"
            size={18}
            color={theme.colors.text.secondary}
          />
          {place.address_name}
        </Text>
        {place.phone && (
          <Text style={styles.infoText}>
            <FontAwesome
              name="phone"
              size={16}
              color={theme.colors.text.secondary}
            />
            {place.phone}
          </Text>
        )}
        <Text style={styles.infoText}>
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={20}
            color={theme.colors.text.secondary}
          />
          {place.distance}m
        </Text>
      </View>
      {address && openModal && (
        <View style={styles.alter}>
          <Text style={styles.alterText}>
            {address[0].road_address.region_1depth_name}{" "}
            {address[0].road_address.region_2depth_name}에 있는 {`\n`}
            {address[0].road_address.building_name}으로 갈까요?
          </Text>
          <TouchableWithoutFeedback>
            <View style={styles.button}>
              <Text style={styles.buttonText}>도착지 설정</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  redoIcon: {
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
    flex: 1.5,
    backgroundColor: theme.colors.text.secondary,
  },
  info: {
    flex: 0.7,
    padding: 10,
  },
  infoText: {
    color: theme.colors.text.secondary,
    marginVertical: 2,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    marginTop: 15,
    marginBottom: 5,
  },
  alter: {
    flex: 0.7,
    backgroundColor: theme.colors.primary,
    padding: 10,
    justifyContent: "center",
  },
  alterText: {
    padding: 10,
    fontSize: 22,
    fontFamily: theme.fonts.NotoSansKR.thin,
    color: theme.colors.background,
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 10,
    display: "flex",
    marginBottom: 10,
  },
  buttonText: {
    color: theme.colors.primary,
    fontSize: 23,
    margin: "auto",
    borderRadius: 10,
    fontFamily: theme.fonts.NotoSansKR.bold,
  },
});

export default DestinationListItem;
