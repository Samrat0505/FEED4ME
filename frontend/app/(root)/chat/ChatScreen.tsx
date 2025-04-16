import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { io, Socket } from "socket.io-client";
import { IncomingMessage, ChatMessage } from "~/lib/Types";
import { getMyMessages } from "~/lib/Api";
import LucidIcons from "~/lib/LucidIcons";
import { SendHorizonal } from "lucide-react-native";
import { useGlobalContext } from "~/Context/ContextProvider";

const SOCKET_SERVER_URL = "ws://15.206.166.59:3000";

export default function ChatScreen() {
  const { chatId, senderId, recieverId, name } = useLocalSearchParams<{
    chatId: string;
    senderId: string;
    recieverId: string;
    name: string;
  }>();
  const { user } = useGlobalContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const FlatlistRef = useRef<FlatList | null>(null);
  const lastElement = useRef<View>(null);

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
    socketRef.current.on("receiveMessage", (data: IncomingMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.message,
          sender: data.senderId === senderId ? "me" : "other",
        },
      ]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    // 4. Emit message
    if (socketRef.current) {
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
    const lastIndex = messages.length - 1;
    if (lastIndex >= 0) {
      FlatlistRef.current?.scrollToIndex({
        index: lastIndex,
        animated: false,
      });
    }
    setNewMessage("");
  };

  const getPrevMessages = async () => {
    const prevMessages = await getMyMessages(chatId);

    if (prevMessages) {
      const transformedMessages: ChatMessage[] = prevMessages.map((msg) => ({
        id: msg._id,
        text: msg.message,
        sender: msg.senderId === senderId ? "me" : "other",
      }));

      setMessages(transformedMessages);
    }
  };

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
    <>
      <Stack.Screen
        options={{
          title: user.user.role === "storage" ? name : `${name}'s owner`,
        }}
      />
      <FlatList
        ref={FlatlistRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 8, flexGrow: 1 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center h-full">
            <Text>No messages</Text>
          </View>
        }
      />
      <View className="flex-row items-center p-2 bg-white border-t border-slate-200 h-16">
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          className="flex-1 bg-slate-100 px-4 py-2 rounded-full mr-2 h-12"
        />
        <Pressable
          onPress={handleSend}
          className="bg-emerald-500 px-4 py-2 rounded-full h-12 flex flex-row gap-2 items-center justify-center"
        >
          <Text className="text-white font-semibold">Send</Text>
          <LucidIcons IconName={SendHorizonal} color="white" />
        </Pressable>
      </View>
    </>
  );
}
