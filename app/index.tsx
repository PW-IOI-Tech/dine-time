import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import uploadData from "@/config/bulkpload";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import logo from "../../assets/images/icon.png";
const logo = require("../assets/images/dinetimelogo.png");
const entryImg = require("../assets/images/Frame.png");
export default function HomeScreen() {
  // useEffect(() => { {
  //   uploadData();
  // }
  // }, []);
  const handleGuest=async()=>{
    await AsyncStorage.setItem('isGuest', "true");
    router.push("/home")
  }
  const router = useRouter();
  return (
    <SafeAreaView className="bg-[#2b2b2b]">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center items-center">
          <Image source={logo} style={{ width: 220, height: 220 }} />
          <View className="w-3/4">
            <TouchableOpacity
              onPress={() => router.push("/signup")}
              className="p-2 my-2 bg-[#f49b33] text-black rounded-lg"
            >
              <Text className="text-lg font-semibold text-center">Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGuest}
              className="p-2 my-2 bg-[#2b2b2b] border border-[#f49b33] text-black rounded-lg max-w-fit"
            >
              <Text className="text-lg text-[#f49b33] font-semibold text-center">
                Guest User
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-center text-lg font-semibold my-4 text-white">
            <View className="border-b-2 border-[#f49b33] p-2 w-24" /> or{" "}
            <View className="border-b-2 border-[#f49b33] p-2 w-24" />
          </Text>
          <TouchableOpacity
            className="flex flex-row justify-center items-center"
            onPress={() => router.push("/signin")}
          >
            <Text className="font-semibold text-white">Already a User? </Text>
            <Text className="text-base font-semibold text-[#f49b33] underline">
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <Image
            source={entryImg}
            className="w-ull h-full"
            resizeMode="contain"
          />
        </View>
        <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />
      </ScrollView>
    </SafeAreaView>
  );
}
