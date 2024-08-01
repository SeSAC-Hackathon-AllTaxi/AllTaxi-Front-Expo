import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

const MicAnimation = ({
  size = 100,
  color = "#FF6B6B",
  duration = 2000,
  isAnimating = true,
}) => {
  const animatedValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    let animations: Animated.CompositeAnimation[] = [];
    if (isAnimating) {
      animations = animatedValues.map((value, index) =>
        Animated.loop(
          Animated.timing(value, {
            toValue: 1,
            duration: duration,
            delay: index * (duration / 3), // 각 원의 시작 시간을 지연
            useNativeDriver: true,
          })
        )
      );
      Animated.parallel(animations).start();
    } else {
      animatedValues.forEach((value) => value.setValue(0));
    }
    console.log(isAnimating, "test");

    return () => {
      animations.forEach((animation) => animation.stop());
    };
  }, [isAnimating, duration]);

  const createPulseStyle = (animatedValue: Animated.Value) => ({
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.6],
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {animatedValues.map((value, index) => (
        <Animated.View
          key={index}
          style={[
            styles.pulse,
            createPulseStyle(value),
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: color,
            },
          ]}
        />
      ))}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  pulse: {
    position: "absolute",
    borderWidth: 4,
    borderColor: "#FF6B6B",
    borderStyle: "solid",
  },
  circle: {
    backgroundColor: "#FF6B6B",
  },
});

export default MicAnimation;
