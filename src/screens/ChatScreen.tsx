import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import io from "socket.io-client";
import { VOICE_CHAT_URL } from "@env";

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
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // 소켓 연결
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
          navigation.navigate("Destination");
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

  const handleSend = () => {
    if (inputText.trim() === "") return;
    addMessage("user", inputText);
    // 서버로 메시지 전송
    socketRef.current?.emit("message", { message: inputText });
    setInputText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // iOS에서 상단 네비게이션 바 높이를 고려
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
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
                style={
                  msg.type === "user" ? styles.userMessage : styles.botMessage
                }
              >
                <Text>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="메시지를 입력하세요"
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>전송</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "flex-end",
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
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatScreen;
