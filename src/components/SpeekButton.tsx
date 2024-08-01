import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MicAnimation from "./MicAnimation";
import { theme } from "constants/theme";
import { typography } from "constants/typography";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";

const SpeakButton = ({ onPress }: any) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.option}>
        <MicAnimation
          size={200}
          color={theme.colors.primary}
          duration={1500}
          isAnimating={isAnimating}
        />
        <View style={styles.content}>
          {isAnimating ? (
            <Entypo
              name="dots-three-horizontal"
              size={59}
              color={theme.colors.background}
            />
          ) : (
            <FontAwesome5
              name="microphone"
              size={59}
              color={theme.colors.background}
            />
          )}

          <Text style={[typography.header, styles.text]}>
            {isAnimating ? "듣는 중..." : "직접 말하기"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  option: {
    justifyContent: "center",
    alignItems: "center",
    height: 130,
    position: "absolute",
    bottom: 70,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    zIndex: 1,
  },
  content: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: theme.colors.background,
    marginTop: 5,
    fontWeight: 600,
  },
});

export default SpeakButton;
