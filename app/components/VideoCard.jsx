import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { icons } from "../../constants";
import { Video, ResizeMode } from "expo-av";
import Modal from "react-native-modal";
import { addBookmark, getUserSession } from "../lib/appwrite";
import { useGlobalContext } from "../(auth)/context/GlobalProvider";

const VideoCard = ({ video }) => {
  const { user } = useGlobalContext();

  const {
    $id,
    title,
    thumbnail,
    video: videoUrl,
    users: { username, avatar },
  } = video;

  const [play, setPlay] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleBookmark = async () => {
    try {
      await addBookmark(video.$id, user.$id);
      Alert.alert("Bookmark", "Video bookmarked successfully!");
      toggleModal();
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log(error.message);
    }
  };

  const handleEdit = () => {
    toggleModal();
  };
  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row items-start gap-3">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular">
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <TouchableOpacity onPress={toggleModal}>
            <Image
              source={icons.menu}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      {play ? (
        <Video
          source={{ uri: videoUrl }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center">
          <>
            <Image
              source={{ uri: thumbnail }}
              onError={() => setThumbnailError(true)}
              className="w-full h-full round-xl mt-3"
              resizeMode="cover"
            />
            <Image
              source={icons.play}
              className="w-12 h-12 absolute"
              resizeMode="contain"
            />
          </>
        </TouchableOpacity>
      )}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View className="bg-white p-4 rounded-lg">
          <TouchableOpacity onPress={handleBookmark}>
            <Text className="text-lg mb-2">Bookmark</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit}>
            <Text className="text-lg">Edit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default VideoCard;
