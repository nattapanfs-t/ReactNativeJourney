import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../components/EmptyState";
import { getUserPost, signOut } from "../lib/appwrite";
import useAppwrite from "../lib/useAppwrite";
import VideoCard from "../components/VideoCard";
import { useGlobalContext } from "../(auth)/context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../components/InfoBox";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const Profile = () => {
  const { user, setUser, setisLoggedIn } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPost(user.$id));

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setisLoggedIn(false);
      router.replace("/sign-in");
      await SecureStore.deleteItemAsync("userEmail");
      await SecureStore.deleteItemAsync("userPassword");
    } catch (error) {
      Alert.alert("An error occurred while logging out", error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10">
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            className="justify-center items-center"
            title="No Video Found"
            subtitle="No Video Found For This Search Query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
