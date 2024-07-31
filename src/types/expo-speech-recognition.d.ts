declare module "expo-speech-recognition" {
  export function requestPermissionsAsync(): Promise<{ status: string }>;

  export function startListeningAsync(
    options: {
      language?: string;
      partialResults?: boolean;
    },
    callback: (result: {
      eventType: "recognizedResult" | "partialResult";
      result: string[];
    }) => void
  ): Promise<void>;

  export function stopListeningAsync(): Promise<void>;
}
