import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import io from "socket.io-client";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { GOOGLE_SPEECH_TO_TEXT_API_KEY, VOICE_CHAT_URL } from "@env";
import { AUDIO_HIGH_QUALITY } from "constants/audio";
import { AntDesign } from "@expo/vector-icons";
import { typography } from "constants/typography";
import { theme } from "constants/theme";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Destination: undefined;
};

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "Chat">;

type Props = {
  navigation: ChatScreenNavigationProp;
};

const ChatScreenTest = ({ navigation }: Props) => {
  const [serverMessage, setServerMessage] = useState("지금 말씀하세요.");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [destination, setDestination] = useState("");
  const [userScript, setUserScript] = useState("");
  const socketRef = useRef<any>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    socketRef.current = io(VOICE_CHAT_URL);

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
    });

    socketRef.current.on(
      "response",
      (data: { message: string; destination: string }) => {
        setServerMessage(data.message);
        if (data.destination) {
          setDestination(data.destination);
          navigation.navigate("Destination", { destination: data.destination });
        }
      }
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (recording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [recording]);

  const toggleRecording = async () => {
    if (recording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access microphone is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        AUDIO_HIGH_QUALITY
      );

      recordingRef.current = recording;
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      console.log("Recording stopped and stored at", uri);

      recordingRef.current = null;
      setRecording(null);

      const file = await FileSystem.readAsStringAsync(uri!, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const API_KEY = GOOGLE_SPEECH_TO_TEXT_API_KEY;
      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            config: {
              encoding: "LINEAR16",
              sampleRateHertz: 44100,
              languageCode: "ko-KR",
            },
            audio: {
              content: file,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const transcript = data.results[0]?.alternatives[0]?.transcript || "";
      console.log("Transcription:", transcript);
      if (transcript) {
        setUserScript(transcript);
        socketRef.current?.emit("message", { message: transcript });
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Failed to stop recording", error);
      Alert.alert("Failed to process audio", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <AntDesign name="sound" size={32} color="black" />
        <Text style={[typography.header, { marginLeft: 5 }]}>
          {serverMessage}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={toggleRecording}>
          <Animated.View
            style={[styles.recordButton, { transform: [{ scale: pulseAnim }] }]}
          >
            {recording ? (
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
              {recording ? "듣는 중..." : "직접 말하기"}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
      <View style={styles.footerContainer}>
        <Text style={[typography.header, styles.footerText]}>{userScript}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "space-between",
  },
  info: {
    paddingTop: 80,
    flex: 0.3,
    backgroundColor: theme.colors.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    zIndex: 1,
    display: "flex",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerText: {
    fontSize: 18,
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recordButton: {
    width: 200,
    height: 200,
    borderRadius: 500,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerContainer: {
    borderTopColor: theme.colors.text.secondary,
    borderTopWidth: 0.3,
    flex: 0.5,
    padding: 20,
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
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

  text: {
    color: theme.colors.background,
    marginTop: 5,
    fontWeight: 600,
  },
});

export default ChatScreenTest;
