import { View, Text, Platform, ScrollView, Image, ImageBackground, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { restaurants } from "../../store/restaurants";
import { query,collection, getDocs } from 'firebase/firestore';
const logo = require("../../assets/images/dinetimelogo.png");
const homebanner = require("../../assets/images/homeBanner.png")
import { BlurView } from 'expo-blur';
import { db } from '@/config/firebaseConfig';
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
const home = () => {
    const [restaurants, setRestaurants] = React.useState<Array<any>>([]);
    const router = useRouter();
    const temp= async()=>{
        const value = await AsyncStorage.getItem('isGuest');
        const value1 = await AsyncStorage.getItem('isEmail');
    }
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() =>router.push(`/restaurant/${item.name}`)} className="bg-[#5f5f5f] max-h-64 max-w-xs flex justify-center rounded-lg mx-4 p-4 shadow-md">
            <Image resizeMode='cover' source={{ uri: item.image }} className="mt-2 mb-1 h-28 rounded-t-lg" />
            <View>
                <Text className="text-white  text-lg font-bold mb-2">{item.name}</Text>
                <Text className="text-white text-base mb-2">{item.address}</Text>
                <Text className="text-white text-base mb-2">Open: {item.opening} - Close: {item.closing}</Text>
            </View>
        </TouchableOpacity>
    )
   const getRestaurants = async () => {
    try {
        const q = query(collection(db, "restaurants"));
        const res = await getDocs(q);
        const data: Array<any> = [];
        res.forEach((item) => {
            data.push({ id: item.id, ...item.data() });
        });
        setRestaurants(data);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
    }
}
    useEffect(() => {
        getRestaurants();
        temp();
    }, []);
    return (
        <SafeAreaView style={[{ backgroundColor: "#2b2b2b" },Platform.OS === 'android' ? { paddingBottom:50 } : { paddingBottom:30}]}>
            <View className="flex items-center">
                <View className="bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg justify-center items-center">
                    <View className="flex flex-row">
                        <Text className={`text-base align-middle h-12 ${Platform.OS === 'ios' ? "pt-[8px]" : "pt-1"} text-white`}>
                            {" "}
                            Welcome to {" "}</Text>
                        <Image resizeMode="cover" className="w-20 h-12" source={logo} />
                    </View>
                </View>

            </View>
            <ScrollView stickyHeaderIndices={[0]}>
                <ImageBackground source={homebanner} resizeMode='cover' className="mb-4 w-full bg-[#2b2b2b] h-52 items-center justify-center">
                    <BlurView intensity={Platform.OS === "android" ? 100 : 50} tint="dark" className='W-full p-4 shadow-lg'>
                        <Text className="text-center text-white text-3xl font-bold">Dine with your loved ones</Text>
                    </BlurView>
                </ImageBackground>
                <View className="flex flex-row items-center bg-[#2b2b2b] p-4">
                    <Text className="text-white text-3xl font-semibold mr-2">Special Discounts %</Text>
                </View>
                {
                    restaurants.length > 0 ? <FlatList data={restaurants} renderItem={renderItem} horizontal contentContainerStyle={{ paddingHorizontal: 16 }} showsHorizontalScrollIndicator={false} scrollEnabled={true} /> : <ActivityIndicator animating color={"#fb0b33"} />
                }
                <View className="flex flex-row items-center bg-[#2b2b2b] p-4">
                    <Text className="text-[#fb9b33] text-3xl font-semibold mr-2">Our Restaurants</Text>
                </View>
                {
                    restaurants.length > 0 ? <FlatList data={restaurants} renderItem={renderItem} horizontal contentContainerStyle={{ paddingHorizontal: 16 }} showsHorizontalScrollIndicator={false} scrollEnabled={true} /> : <ActivityIndicator animating color={"#fb0b33"} />
                }

            </ScrollView>
        </SafeAreaView>
    )
}

export default home