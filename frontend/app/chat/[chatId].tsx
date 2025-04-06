import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState, MutableRefObject } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { io, Socket } from "socket.io-client";
import { IncomingMessage, ChatMessage } from "~/lib/Types";
import {getMyMessages} from "~/lib/Api";

const SOCKET_SERVER_URL = "ws://15.206.166.59:3000";


export default function ChatScreen() {
  const { chatId, senderId, recieverId } = useLocalSearchParams<{
    chatId: string;
    senderId: string;
    recieverId: string;
  }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 0. get the previous messages
    getPrevMessages();

    // 1. Connect socket
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    // 2. Join chat room
    socketRef.current.emit("joinRoom", {
      senderId,
      recieverId,
    });

    // 3. Listen for incoming messages
    socketRef.current.on("receiveMessage", (data : IncomingMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.message,
          sender: data.senderId === senderId ? "me" : "other",
        },
      ]);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);


  const handleSend = () => {
    if (!newMessage.trim()) return;

    // 4. Emit message
    if(socketRef.current){
        socketRef.current.emit("sendMessage", {
        senderId,
        recieverId,
        message: newMessage,
        });
    }

    // Optionally update local state immediately
    // setMessages((prev) => [
    //   ...prev,
    //   { id: Date.now().toString(), text: newMessage, sender: "me" },
    // ]);
    setNewMessage("");
  };

  const getPrevMessages = async () =>{
    const prevMessages = await getMyMessages(chatId);

    if (prevMessages) {
        const transformedMessages: ChatMessage[] = prevMessages.map((msg) => ({
        id: msg._id,
        text: msg.message,
        sender: msg.senderId === senderId ? "me" : "other",
        }));

        setMessages(transformedMessages);
  }
  }


const renderItem = ({ item }: { item: ChatMessage }) => (
    <View
      className={`p-2 my-1 max-w-[80%] rounded-lg ${
        item.sender === "me"
          ? "bg-emerald-500 self-end"
          : "bg-slate-200 self-start"
      }`}
    >
      <Text className={item.sender === "me" ? "text-white" : "text-black"}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <View className="flex-1 px-4 pt-4">
        <Text className="text-xl font-bold mb-2">Chat with: {chatId}</Text>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0 flex-row items-center p-2 bg-white border-t border-slate-200">
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          className="flex-1 bg-slate-100 px-4 py-2 rounded-full mr-2"
        />
        <Pressable
          onPress={handleSend}
          className="bg-emerald-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-semibold">Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}