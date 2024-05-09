import { useState } from "react";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../components/SearchInput";
import Trending from "../components/Trending";
import EmptyState from "../components/EmptyState";

const Home = () => {
  const [refresing, setrefresing] = useState(false);
  const onRefresh = async () => {
    setrefresing(true);
    //if any new videos appeard
    setrefresing(false);
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Text className="text-3xl text-white">{item.id}</Text>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6 ">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-gray-100">
                  Taam
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMethod="contain"
                />
              </View>
            </View>
            <SearchInput />
            <Text className="font-pregular text-lg text-gray-100 mb-3">
              Latest Video
            </Text>
            <Trending posts={[{ id: 1 }, { id: 2 }, { id: 3 }] ?? []} />
            <View className="w-4 flex-1 pt-5 pb-8"></View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            className="justify-center items-center"
            title="No Video Found"
            subtitle="Be The First One To Upload a Video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refresing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
