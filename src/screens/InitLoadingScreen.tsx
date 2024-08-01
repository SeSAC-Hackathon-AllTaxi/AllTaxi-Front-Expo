import { theme } from "constants/theme";
import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";

const InitLoadingScreen = () => {
  const USER_NAME = "김소미";
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>올택시</Text>
        <ActivityIndicator size="large" color={theme.colors.background} />
      </View>
      <View style={styles.info}>
        <Text style={styles.infoText}> {USER_NAME}님, </Text>
        <Text style={styles.infoText}> 안녕하세요! </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    flex: 0.8,
    backgroundColor: theme.colors.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    width: "100%",
  },
  titleText: {
    fontSize: 50,
    fontFamily: theme.fonts.NotoSansKR.bold,
    color: theme.colors.background,
    marginBottom: 15,
  },
  info: {
    flex: 0.2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    width: "100%",
    height: 170,
    backgroundColor: theme.colors.background,
  },
  infoText: {
    fontSize: 28,
    fontFamily: theme.fonts.NotoSansKR.bold,
  },
});

export default InitLoadingScreen;
