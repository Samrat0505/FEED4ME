import { View, Text, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {getChatList } from "~/lib/Api"
import { useGlobalContext } from "~/Context/ContextProvider";
import { Chat } from "~/lib/Types";

export default function ChatListScreen() {
    const [chats, setChats] = useState<Chat[] | null>(null);
    const { user } = useGlobalContext();


    useEffect(()=>{
        getMyChats()
    }, [])

    const getMyChats = async () =>{
        const list = await getChatList(user.user._id);
        setChats(list);
    }

  const renderItem = ({ item }: { item: Chat }) => (
    <Pressable
    //   onPress={() => router.push(`/chat/${item.roomId}`)}
    onPress={() => {
        console.log("inside the on press function")
        const recieverId = item.participant;
        const senderId = user.user._id;
        const chatId = String([senderId, recieverId].sort().join("-"));
        router.push({
          pathname: '/chat/[chatId]',
          params: { chatId, senderId, recieverId },
        });
      }}
      className="p-4 border-b border-gray-200 bg-white"
    >
      <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
      <Text className="text-sm text-gray-500 mt-1">{item.lastMessage}</Text>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <Text className="text-2xl font-bold px-4 py-10 text-gray-800">Chats</Text>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.roomId}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
