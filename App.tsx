import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "screens/HomeScreen";
import { ThemeProvider } from "contexts/ThemeContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import DestinationScreen from "screens/DestinationScreen";
import { useLocationStore } from "./src/state/locationStore";
import DestinationDetailScreen from "screens/DestinationDetailScreen";
import MyLocationScreen from "screens/MyLocationScreen";
import CameraScreen from "screens/CameraScreen";
import InitLoadingScreen from "screens/InitLoadingScreen";
import TaxiMatchScreen from "screens/TaxiMatchScreen";
import ChatScreenTest from "screens/ChatScreenTest";
import MatchedScreen from "screens/MatchedScreen";

export type RootStackParamList = {
  올택시: undefined;
  Booking: undefined;
  Chat: undefined;
  MyLocation: { requestId: number };
  Destination: { destination: string } | undefined;
  DestinationDetail: { place: Object; onBack: () => void };
  Camera: undefined;
  TaxiMatchScreen: undefined;
  MatchedScreen: { requestId: number , x: string, y: string };
};

const Stack = createStackNavigator<RootStackParamList>();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    NotoSansKR: require("./assets/fonts/NotoSansKR/NotoSansKR-Black.ttf"),
    "NotoSansKR-Bold": require("./assets/fonts/NotoSansKR/NotoSansKR-Bold.ttf"),
  });
  const fetchLocation = useLocationStore((state) => state.fetchLocation);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const loadLocation = async () => {
      await fetchLocation();
      setIsLocationLoaded(true);
    };
    loadLocation();
  }, []);

  if (!fontsLoaded || !isLocationLoaded) {
    return <InitLoadingScreen />;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="올택시"
        >
          <Stack.Screen name="Destination" component={DestinationScreen} />
          <Stack.Screen
            name="DestinationDetail"
            component={DestinationDetailScreen}
          />
          <Stack.Screen name="올택시" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreenTest} />
          <Stack.Screen name="MyLocation" component={MyLocationScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="TaxiMatchScreen" component={TaxiMatchScreen} />
          <Stack.Screen name="MatchedScreen" component={MatchedScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
