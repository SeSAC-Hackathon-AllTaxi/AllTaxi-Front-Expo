import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import io from "socket.io-client";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { GOOGLE_SPEECH_TO_TEXT_API_KEY, VOICE_CHAT_URL } from "@env";
import { AUDIO_HIGH_QUALITY } from "constants/audio";

interface Message {
  type: "user" | "bot";
  text: string;
}

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Destination: undefined;
};

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "Chat">;

type Props = {
  navigation: ChatScreenNavigationProp;
};

const ChatScreen = ({ navigation }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const socketRef = useRef<any>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    socketRef.current = io(VOICE_CHAT_URL);

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
    });

    socketRef.current.on(
      "response",
      (data: { message: string; destination: string }) => {
        addMessage("bot", data.message);
        if (data.destination) {
          console.log("Destination:", data.destination);
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

  const addMessage = (type: "user" | "bot", text: string) => {
    setMessages((prev) => [...prev, { type, text }]);
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

      // Clear the recording reference and state
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
        addMessage("user", transcript);
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
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={msg.type === "user" ? styles.userMessage : styles.botMessage}
          >
            <Text>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.voiceButton, recording && styles.recordingButton]}
          onPress={recording ? stopRecording : startRecording}
        >
          <Text style={styles.voiceButtonText}>
            {recording ? "Recording..." : "Hold to Speak"}
          </Text>
        </TouchableOpacity>
      </View>
      {recording && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messagesContent: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d1e7dd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "70%",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "70%",
  },
  inputContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  voiceButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  recordingButton: {
    backgroundColor: "#dc3545",
  },
  voiceButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatScreen;
