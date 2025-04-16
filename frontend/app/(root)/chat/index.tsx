import { View, Text, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getChatList } from "~/lib/Api";
import { useGlobalContext } from "~/Context/ContextProvider";
import { Chat } from "~/lib/Types";
import LucidIcons from "~/lib/LucidIcons";
import { User } from "lucide-react-native";

export default function ChatListScreen() {
  const [chats, setChats] = useState<Chat[] | null>(null);
  const { user } = useGlobalContext();

  useEffect(() => {
    getMyChats();
  }, []);

  const getMyChats = async () => {
    const list = await getChatList(user.user._id);
    setChats(list);
  };

  const renderItem = ({ item }: { item: Chat }) => (
    <Pressable
      onPress={() => {
        const recieverId = item.participant;
        const senderId = user.user._id;
        const name = item.name;
        const chatId = String([senderId, recieverId].sort().join("-"));
        router.push({
          pathname: "/(root)/chat/ChatScreen",
          params: { chatId, senderId, recieverId, name },
        });
      }}
      className="p-2 px-4 border-b border-muted bg-white flex items-center justify-start gap-3 flex-row"
    >
      <View className="p-3 bg-slate-100 rounded-full">
        <LucidIcons IconName={User} />
      </View>
      <View>
        <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500 mt-1">
          {item.lastMessage ?? "No last message"}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={chats}
        keyExtractor={(item) => item.roomId}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
