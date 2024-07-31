import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { GOOGLE_SPEECH_TO_TEXT_API_KEY } from "@env";

const VoiceRecognition: React.FC = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const recordingRef = useRef<Audio.Recording | null>(null);

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

      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".caf",
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

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
      setTranscription(transcript);
      console.log("Transcription:", transcript);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Failed to stop recording", error);
      Alert.alert("Failed to process audio", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {recording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.transcription}>{transcription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  transcription: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default VoiceRecognition;
