import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

const TabComponent = ({
  tabsData,
  Pages,
  setCurrentTab,
}: {
  tabsData: { name: string }[];
  Pages: React.ReactElement[];
  setCurrentTab?: Function;
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const PagerRef = useRef<PagerView>(null);
  const ChangePage = (index: number) => {
    PagerRef.current?.setPage(index);
  };
  const screenWidth = Dimensions.get("window").width;
  const pageSelectedHandler = (event: PagerViewOnPageSelectedEvent) => {
    setActiveTab(event.nativeEvent.position);
    setCurrentTab && setCurrentTab(event.nativeEvent.position);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      const tabWidth = screenWidth / tabsData.length;
      const scrollTo = tabWidth * activeTab - screenWidth / 2 + tabWidth / 2;
      scrollViewRef.current.scrollTo({ x: scrollTo, animated: true });
    }
  }, [activeTab]);

  return (
    <View className="flex-1">
      <View>
        <ScrollView
          className="dark:bg-gray-800"
          horizontal={true}
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
        >
          <View className="px-3 flex justify-center items-center pr-4 flex-row gap-3 border-b border-muted">
            {tabsData?.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  className={cn(
                    activeTab === index
                      ? " border-b-2 border-blue-700 dark:border-sky-500"
                      : "",
                    "p-2 px-4 "
                  )}
                  onPress={() => {
                    ChangePage(index);
                  }}
                >
                  <Text
                    className={cn(
                      activeTab === index
                        ? "font-bold text-blue-700 dark:text-sky-500"
                        : ""
                    )}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <PagerView
        style={styles.pagerView}
        initialPage={0}
        ref={PagerRef}
        onPageSelected={pageSelectedHandler}
      >
        {Pages?.map((Item: React.ReactElement, index: number) => {
          return (
            <View key={index} className="flex-1">
              {Item}
            </View>
          );
        })}
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default TabComponent;
