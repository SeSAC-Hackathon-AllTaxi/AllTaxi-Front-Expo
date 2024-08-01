import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "contexts/ThemeContext";
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  MyLocation: { requestId: number };
  Destination: { destination: string } | undefined;
  DestinationDetail: { place: Object; onBack: () => void };
  TaxiMatchScreen: { requestId: number };
  MatchedScreen: { requestId: number };
};

const TaxiMatchScreen = () => {
  const { typography } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { requestId } = route.params;

  useEffect(() => {
    const matchTaxi = async () => {
      try {
        const response = await axios.post(`http://3.34.131.133:8080/api/match-taxi/${requestId}`);
        console.log("Taxi matched successfully:", response.data);

        // 정상적으로 매칭된 경우에만 MatchedScreen으로 이동
        setTimeout(() => {
          navigation.navigate('MatchedScreen', { requestId });
        }, 4000); // 4초 대기
      } catch (error) {
        console.error("Error matching taxi:", error);
      }
    };

    matchTaxi();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(226, 115, 67, 0.59)', '#E27343']}
        style={styles.gradientBackground}
      >
        <View style={styles.content}>
          <Image
            source={{ uri: 'https://all-taxi.s3.ap-northeast-2.amazonaws.com/19148+1.png' }}
            style={styles.image}
          />
        </View>
      </LinearGradient>
      <View style={styles.header}>
        <AntDesign name="sound" size={32} color="black" />
        <Text style={[typography.header, { marginLeft: 5 }]}>
          택시를 찾고 있어요
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 185,
    flexShrink: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#FFF',
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  image: {
    width: 200,
    height: 180,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default TaxiMatchScreen;
