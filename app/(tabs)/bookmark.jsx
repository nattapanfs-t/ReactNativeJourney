import React, { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../components/SearchInput";
import EmptyState from "../components/EmptyState";
import { getBookmarkPost, searchPosts } from "../lib/appwrite";
import useAppwrite from "../lib/useAppwrite";
import VideoCard from "../components/VideoCard";
import { useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "../(auth)/context/GlobalProvider";

const Bookmark = () => {
  const { query } = useLocalSearchParams();
  const { user } = useGlobalContext();

  const { data: bookmarkedPosts, refetch } = useAppwrite(() =>
    getBookmarkPost(user.$id)
  );
  const { data: searchedPosts } = useAppwrite(() => searchPosts(query));

  const [refresing, setreFresing] = useState(false);
  const onRefresh = async () => {
    setreFresing(true);
    await refetch();
    setreFresing(false);
  };

  const posts = query ? searchedPosts : bookmarkedPosts;

  console.log(bookmarkedPosts);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-2xl text-gray-100">
              Bookmarked Videos
            </Text>
            {query && (
              <Text className="text-2xl font-psemibold text-gray-100">
                {query}
              </Text>
            )}
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query || ""} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            className="justify-center items-center"
            title="No Video Found"
            subtitle={
              query
                ? "No Video Found For This Search Query"
                : "No Bookmarked Videos"
            }
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refresing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
