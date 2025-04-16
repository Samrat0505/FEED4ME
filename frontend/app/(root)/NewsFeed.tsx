import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getDailyNews, NewsFeed as NewsFeedType } from "~/lib/Api";
import { formatDistanceToNow } from "date-fns";

const NewsFeed = () => {
  const [data, setData] = useState<NewsFeedType[]>([]);
  const [filteredData, setFilteredData] = useState<NewsFeedType[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    const result = await getDailyNews();
    if (result) {
      setData(result);
      setFilteredData(result);
      extractTags(result);
    }
    setIsLoading(false);
  };

  const extractTags = (news: NewsFeedType[]) => {
    const allTags = news.flatMap((item) => item.tags);
    const uniqueTags = Array.from(new Set(allTags));
    setTags(uniqueTags);
  };

  const filterByTag = (tag: string) => {
    setSelectedTag(tag);
    const filtered = data.filter((item) => item.tags.includes(tag));
    setFilteredData(filtered);
  };

  const clearFilter = () => {
    setSelectedTag(null);
    setFilteredData(data);
  };

  const renderItem = ({ item }: { item: NewsFeedType }) => (
    <View className="m-2 rounded-xl border border-muted overflow-hidden">
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />
      )}
      <View className="p-4">
        <Text className="text-xl font-semibold text-gray-800 mb-1">
          {item.title}
        </Text>
        <View className="flex-row flex-wrap gap-1 mb-2">
          {item.tags.map((tag, index) => (
            <Text
              key={index}
              className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full"
            >
              #{tag}
            </Text>
          ))}
        </View>
        <Text className="text-sm text-gray-600 mb-2">{item.content}</Text>
        <Text className="text-xs text-gray-400">
          By {item.authorName} •{" "}
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </Text>
      </View>
    </View>
  );

  const renderTags = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-2 mb-3 h-8 pr-4"
    >
      <TouchableOpacity onPress={clearFilter}>
        <Text
          className={`mr-2 px-3 py-1 rounded-full ${
            selectedTag === null
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          All
        </Text>
      </TouchableOpacity>
      {isLoading ? (
        <Text className="mr-2 px-3 py-1">Loading tags...</Text>
      ) : (
        <>
          {tags.map((tag) => (
            <TouchableOpacity key={tag} onPress={() => filterByTag(tag)}>
              <Text
                className={`mr-2 px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                #{tag}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );

  return (
    <View className="flex-1">
      {renderTags()}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchNews} />
        }
        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
          justifyContent: "flex-start",
        }}
      />
    </View>
  );
};

export default NewsFeed;
