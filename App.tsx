import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "screens/HomeScreen";
import { ThemeProvider } from "contexts/ThemeContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import DestinationScreen from "screens/DestinationScreen";
import { useLocationStore } from "./src/state/locationStore";
import ChatScreen from "screens/ChatScreen";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { theme } from "constants/theme";

type RootStackParamList = {
  올택시: undefined;
  Booking: undefined;
  Destination: undefined;
  Chat: undefined;
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.text.secondary} />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="올택시">
          <Stack.Screen name="Destination" component={DestinationScreen} />
          <Stack.Screen name="올택시" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
});
