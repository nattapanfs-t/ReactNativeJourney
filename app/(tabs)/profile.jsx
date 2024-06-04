import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
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
import { AntDesign } from "@expo/vector-icons";

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user, setUser, setisLoggedIn } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPost(user.$id));

  const logoutPress = () => {
    setModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setisLoggedIn(false);
      setModalVisible(false);
      await SecureStore.deleteItemAsync("userEmail");
      await SecureStore.deleteItemAsync("userPassword");
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert("An error occurred while logging out", error.message);
    }
  };

  const cancel = () => {
    setModalVisible(false);
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
              onPress={logoutPress}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancel}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Are You Sure To Sign Out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={confirmLogout}
                style={styles.logoutButton}>
                <Text style={{ color: "#CDCDE0", fontWeight: "bold" }}>
                  <AntDesign name="logout" size={15} color="#CDCDE0" />
                  Sign out
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancel} style={styles.cancelButton}>
                <Text style={{ color: "#CDCDE0", fontWeight: "bold" }}>
                  <AntDesign name="back" size={17} color="#CDCDE0" />
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#232533",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#CDCDE0",
  },
  modalButtons: {
    flexDirection: "row",
  },
  logoutButton: {
    // backgroundColor: "red",
    borderRadius: 13,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    // elevation: 5,
    margin: 10,
  },
  cancelButton: {
    // backgroundColor: "#ffa300",
    opacity: "0.8",
    borderRadius: 13,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    // elevation: 5,
    margin: 10,
  },
};

export default Profile;
