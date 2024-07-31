import {
  AndroidOutputFormat,
  AndroidAudioEncoder,
  IOSAudioQuality,
} from "expo-av/build/Audio";

export const AUDIO_HIGH_QUALITY = {
  android: {
    extension: ".m4a",
    outputFormat: AndroidOutputFormat.MPEG_4,
    audioEncoder: AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".caf",
    audioQuality: IOSAudioQuality.MAX,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
