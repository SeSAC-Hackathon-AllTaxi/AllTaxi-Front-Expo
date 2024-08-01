import { theme } from "constants/theme";
import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, ActivityIndicator, Image } from "react-native";

const InitLoadingScreen = () => {
  const USER_NAME = "김소미";
  return (
    <View style={styles.container}>
      <View style={styles.title}>
      <Image
          source={{ uri: 'https://all-taxi.s3.ap-northeast-2.amazonaws.com/Group+1.png' }}
          style={styles.logoImage}
        />
        <Text style={styles.titleText}>올택시</Text>
        <ActivityIndicator size="large" color={theme.colors.background} />
        <Image
        source={{ uri: 'https://all-taxi.s3.ap-northeast-2.amazonaws.com/7047+1.png' }}
        style={styles.image}
      />
      </View>
      <View style={styles.info}>
        <Text style={styles.infoText}>{USER_NAME}님,</Text>
        <Text style={styles.infoText}>안녕하세요!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    flex: 0.8,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  image: {
    width: 369,
    height: 182,
    resizeMode: "contain",
    marginBottom: -280,
  },
  titleText: {
    fontSize: 50,
    fontFamily: theme.fonts.NotoSansKR.bold,
    color: theme.colors.background,
    marginBottom: 30,
  },
  info: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    width: 375,
    height: 812,
    backgroundColor: theme.colors.background,
  },
  infoText: {
    fontSize: 28,
    fontFamily: theme.fonts.NotoSansKR.bold,
  },
});

export default InitLoadingScreen;
