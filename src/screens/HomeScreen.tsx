import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "contexts/ThemeContext";
import { theme } from "constants/theme";

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const { theme, typography } = useTheme();
  const click = () => {
    navigation.navigate("Chat");
  };
  return (
    <View style={[styles.container]}>
      <TouchableOpacity onPress={click}>
        <Text style={[typography.header]}>Chat</Text>
      </TouchableOpacity>

      <Text
        style={[
          {
            backgroundColor: theme.colors.primary,
            color: theme.colors.background,
            fontFamily: theme.fonts.NotoSansKR.bold,
          },
        ]}
      >
        홈 화면
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
