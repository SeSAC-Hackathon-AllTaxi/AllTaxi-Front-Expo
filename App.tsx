import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "screens/HomeScreen";
import { ThemeProvider } from "contexts/ThemeContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import MapScreen from "screens/MapScreen";
import DestinationScreen from "screens/DestinationScreen";
import { useLocationStore } from "./src/state/locationStore";

type RootStackParamList = {
  올택시: undefined;
  Booking: undefined;
  목적지: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    NotoSansKR: require("./assets/fonts/NotoSansKR/NotoSansKR-Black.ttf"),
    "NotoSansKR-Bold": require("./assets/fonts/NotoSansKR/NotoSansKR-Bold.ttf"),
  });
  const fetchLocation = useLocationStore((state) => state.fetchLocation);

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  React.useEffect(() => {
    fetchLocation();
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="목적지" component={DestinationScreen} />
          {/* <Stack.Screen name="올택시" component={MapScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
