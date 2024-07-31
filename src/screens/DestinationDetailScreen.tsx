import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { theme } from "constants/theme";
import { useTheme } from "contexts/ThemeContext";
import { FontAwesome, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import {
  DestinationDataProps,
  DestinationDetailsProps,
} from "types/destination";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

interface DestinationDetailScreenProps {
  data: DestinationDataProps;
  details: DestinationDetailsProps;
  img: string;
}

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Destination: { destination: string } | undefined;
  DestinationDetail: DestinationDetailScreenProps;
};

type DestinationDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DestinationDetail"
>;

type DestinationDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "DestinationDetail"
>;

type Props = {
  navigation: DestinationDetailScreenNavigationProp;
  route: DestinationDetailScreenRouteProp;
};

const DestinationDetailScreen = ({ navigation, route }: Props) => {
  const { theme } = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const details = route.params.details;
  const data = route.params.data;
  const img = route.params.img;

  // 현재 요일을 얻기 위한 함수
  const getCurrentDayOfWeek = (): string => {
    const daysOfWeek = [
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
      "일요일",
    ];
    const today = new Date();
    const dayIndex = today.getDay();
    return daysOfWeek[(dayIndex + 6) % 7];
  };

  // 운영 시간을 추출하는 함수
  const getOperatingHours = (weekdayText: string[]): string | null => {
    const currentDay = getCurrentDayOfWeek();

    for (const entry of weekdayText) {
      if (entry.startsWith(currentDay)) {
        return entry.split(": ")[1]; // 요일 이후의 시간 부분을 반환
      }
    }
    return null; // 현재 요일에 대한 운영 시간이 없을 경우
  };

  const operatingHours =
    details.opening_hours &&
    getOperatingHours(details.opening_hours.weekday_text);

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={{ uri: img }} style={styles.image} />
        {details.current_opening_hours &&
          (details.current_opening_hours.open_now ? (
            <View style={styles.openingHour}>
              <Text style={styles.openingHourText}>
                <FontAwesome
                  name="circle"
                  size={24}
                  color={theme.colors.primary}
                />{" "}
                현재 운영중
              </Text>
            </View>
          ) : (
            <View style={styles.openingHour}>
              <Text style={styles.openingHourText}>
                <FontAwesome
                  name="circle"
                  size={24}
                  color={theme.colors.error}
                />{" "}
                운영 종료
              </Text>
            </View>
          ))}
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
        <Text style={styles.title}>{data.terms[0].value}</Text>

        <Text style={styles.infoText}>
          <Ionicons
            name="location-sharp"
            size={18}
            color={theme.colors.text.secondary}
          />
          {details.formatted_address}
        </Text>
        {details.formatted_phone_number && (
          <Text style={styles.infoText}>
            <FontAwesome
              name="phone"
              size={16}
              color={theme.colors.text.secondary}
            />
            {details.formatted_phone_number}
          </Text>
        )}
        {operatingHours != null && (
          <View style={{ marginTop: 10, marginLeft: 20 }}>
            <Text style={styles.infoText}>Opening Time</Text>
            <Text style={{ fontSize: 17 }}>{operatingHours}</Text>
          </View>
        )}
      </View>
      {openModal && (
        <View style={styles.alter}>
          <Text style={styles.alterText}>
            {data.terms[0].value}(으)로 갈까요?
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
  openingHour: {
    position: "absolute",
    left: 10,
    bottom: 10,
  },
  openingHourText: {
    color: theme.colors.background,
    fontSize: 20,
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
  imgContainer: {
    flex: 0.6,
    backgroundColor: theme.colors.text.secondary,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    bottom: 0,
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
    position: "absolute",
    bottom: 0,
    width: "100%",
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

export default DestinationDetailScreen;
