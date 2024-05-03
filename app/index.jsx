import React from "react";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-[#1E1E2D]">
      <Text className="text-3xl font-pbold text-[#fff]">Nat Taam!</Text>
      <StatusBar style="auto" />
      <Link href="/home" style={{ color: "#C6B4FA" }}>
        Go To Home
      </Link>
    </View>
  );
}
