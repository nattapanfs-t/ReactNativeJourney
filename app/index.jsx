import { useEffect, useState } from "react";
import { useGlobalContext } from "./(auth)/context/GlobalProvider";
import { Text, View, Image, Alert, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { images } from "../constants";
import CustomButton from "./components/CustomButton";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { signIn, getCurrentUser } from "./lib/appwrite";

export default function App() {
  const { isLoading, isLoggedIn, setUser, setisLoggedIn } = useGlobalContext();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const email = await SecureStore.getItemAsync("userEmail");
        const password = await SecureStore.getItemAsync("userPassword");

        if (email && password) {
          await signIn(email, password);
          const result = await getCurrentUser();
          setUser(result);
          setisLoggedIn(true);
          setAuthenticated(true);
        } else {
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          if (!hasHardware) {
            Alert.alert("No biometric hardware found");
            return;
          }

          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          if (!isEnrolled) {
            Alert.alert("No biometrics enrolled\nPlease log in manually");
            return;
          }

          const result = await LocalAuthentication.authenticateAsync();
          if (result.success) {
            setAuthenticated(true);
            await handleBiometricLogin();
          } else {
            Alert.alert("Authentication failed");
          }
        }
      } catch (error) {
        Alert.alert("An error occurred during authentication", error.message);
      }
    };
    authenticate();
  }, []);

  const handleBiometricLogin = async () => {
    try {
      const email = await SecureStore.getItemAsync("userEmail");
      const password = await SecureStore.getItemAsync("userPassword");

      if (!email && !password) {
        Alert.alert("No credentials found. Please log in manually.");
        router.push("/sign-in");
      }
    } catch (error) {
      Alert.alert(
        "An error occurred while retrieving credentials",
        error.message
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#161622" }}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full min-h-[84vh] justify-center items-center px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Taam</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2.5 -right-8"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm text-gray-100 text-center font-pregular mt-7">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Taam
          </Text>
          <CustomButton
            title="Continue With Email"
            handlePress={() => router.push("sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
        {isLoading && !isLoggedIn ? (
          <ActivityIndicator size="large" color="#FF9001" />
        ) : null}
      </ScrollView>
      <StatusBar style="light" backgroundColor="#161622" />
      {!isLoading && isLoggedIn && authenticated && <Redirect href={"/home"} />}
    </SafeAreaView>
  );
}
