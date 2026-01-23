import { View, Text, ScrollView, FlatList, Dimensions, Image, Linking, Alert, Platform } from 'react-native';
import React, { useRef, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import DatePickerComponent from '../../components/layout/DatePickerComponent';
import GuestPickerComponent from '@/components/layout/GuestPickerComponent';
import FindSlots from '@/components/layout/FindSlots';
const Restaurant = () => {
    const { restaurant } = useLocalSearchParams();
    const flatListRef = useRef<FlatList>(null);
    const windowWidth = Dimensions.get("window").width;
    const [date, setDate] = React.useState(new Date());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselData, setCarouselData] = useState<Array<any>>([]);
    const [selectedNumber, setSelectedNumber] = useState<number>(2);
    const [restaurantsData, setRestaurantsData] = useState<any>(null);
    const [slotsData, setSlotsData] = useState<Array<any>>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null >(null);
    const handleNextImage = () => {
        const carouselLength = carouselData[0]?.images.length || 0;
        if (carouselLength === 0) return;

        let newIndex = currentIndex + 1;
        if (newIndex >= carouselLength) newIndex = 0; 
        setCurrentIndex(newIndex);
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
    const handlePrevImage = () => {
        const carouselLength = carouselData[0]?.images.length || 0;
        if (carouselLength === 0) return;
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = carouselLength - 1; 
        setCurrentIndex(newIndex);
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }

    const handleLocation = async () => {
        const address = restaurantsData?.address;
        if (!address) {
            Alert.alert("Error", "Address not found");
            return;
        }
        const encodedAddress = encodeURIComponent(address);
        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q='
        });
        const latLngUrl = Platform.select({
            ios: `${scheme}${encodedAddress}`,
            android: `${scheme}${encodedAddress}`
        });
        const browserUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        try {
            const supported = await Linking.canOpenURL(latLngUrl || "");
            if (supported) {
                await Linking.openURL(latLngUrl || "");
            } else {
                await Linking.openURL(browserUrl);
            }
        } catch (err) {
            console.error("An error occurred trying to open map:", err);
            await Linking.openURL(browserUrl);
        }
    }
    const getRestaurants = async () => {
        try {
            const q = query(collection(db, "restaurants"), where("name", "==", restaurant));
            const res = await getDocs(q);
            if (res.empty) return;
            for (const doc of res.docs) {
                setRestaurantsData(doc.data());
                const carouselQuery = query(collection(db, "carousel"), where("res_id", "==", doc.ref));
                const carouselRes = await getDocs(carouselQuery);
                const carouselItems: any[] = [];
                carouselRes.forEach((d) => carouselItems.push(d.data()));
                setCarouselData(carouselItems);
                const slotsQuery = query(collection(db, "slots"), where("ref_id", "==", doc.ref));
                const slotsRes = await getDocs(slotsQuery);
                const slotsItems: any[] = [];
                slotsRes.forEach((d) => slotsItems.push(d.data()));
                setSlotsData(slotsItems[0]?.slot || []);
            }
        } catch (error) {
            console.error("Error fetching Data:", error);
        }
    }
    const carouselItem = ({ item }: { item: string }) => {
        return (
            <View style={{ width: windowWidth - 2 }} className="h-64 relative">
                <View style={{ position: 'absolute', top: "45%", backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 50, padding: 5, zIndex: 10, right: "6%" }}>
                    <Ionicons onPress={handleNextImage} name="arrow-forward" size={24} color="white" />
                </View>
                <View style={{ position: 'absolute', top: "45%", backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 50, padding: 5, zIndex: 10, left: "2%" }}>
                    <Ionicons onPress={handlePrevImage} name="arrow-back" size={24} color="white" />
                </View>
                <View style={{ position: 'absolute', display: 'flex', justifyContent: "center", alignItems: "center", left: "50%", transform: [{ translateX: -50 }], bottom: 15, flexDirection: 'row', zIndex: 10 }}>
                    {carouselData[0]?.images?.map((_: any, i: number) => (
                        <View key={i} className={`bg-white h-2 w-2 ${i === currentIndex && "h-3 w-3"} p-1 mx-1 rounded-full`} />
                    ))}
                </View>
                <Image source={{ uri: item }} style={{ opacity: 0.5, backgroundColor: "black", marginRight: 20, marginLeft: 5, borderRadius: 25 }} className="h-64" />
            </View>
        )
    };

    useEffect(() => {
        getRestaurants();
    }, []);
    return (
        <SafeAreaView style={[{ backgroundColor: "#2b2b2b" }, Platform.OS === 'android' ? { paddingBottom: 50 } : { paddingBottom: 30 }]}>
            <ScrollView className="h-full">
                <View className="flex-1 my-2 p-2">
                    <Text className="text-xl text-[#f49b33] mr-2 font-semibold">{restaurant}</Text>
                    <View className='border-b border-[#f49b33]' />
                </View>
                <View className="h-64 max-w-[98%] mx-2 rounded-[25px]">
                    <FlatList
                        ref={flatListRef}
                        data={carouselData[0]?.images}
                        renderItem={carouselItem}
                        horizontal
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        style={{ borderRadius: 25 }}
                        getItemLayout={(data, index) => (
                            { length: windowWidth - 2, offset: (windowWidth - 2) * index, index }
                        )}
                    />
                </View>
                <View className="flex flex-row mt-2 p-2">
                    <Ionicons name="location-sharp" size={24} color="#f49b33" />
                    <Text className='text-white max-w-[75%] ml-2'>
                        {restaurantsData?.address || "Loading Address..."} | {"  "}
                        <Text onPress={handleLocation} className='underline mt-1 text-[#f49b33] italic font-semibold'>
                            Get Direction
                        </Text>
                    </Text>

                </View>
                <View className="flex flex-row p-2">
                    <Ionicons name="time" size={20} color="#f49b33" />
                    <Text className="max-w-[75%] mx-2 font-semibold text-white">
                        {restaurantsData?.opening} - {restaurantsData?.closing} 
                    </Text>
                </View>
                <View className='flex-1 border m-2 p-2 rounded-lg border-[#f49b33]'>
                    <View className='flex-1 flex-row m-2 p-2 justify-end items-center'>
                        <View className='flex-1 flex-row'>
                            <Ionicons name="calendar" size={20} color="#f49b33" />
                            <Text className="text-white mx-2 font-semibold">Select Date:</Text>
                        </View>
                        <DatePickerComponent date={date} setDate={setDate} />
                    </View>
                    <View className='flex-1 flex-row bg-[#474747] rounded-lg m-2 p-2 justify-end items-center'>
                        <View className='flex-1 flex-row'>
                            <Ionicons name="people" size={20} color="#f49b33" />
                            <Text className="text-white mx-2 font-semibold">Select Number of Guests</Text>
                        </View>
                        <GuestPickerComponent selectedNumber={selectedNumber} setSelectedNumber={setSelectedNumber} />
                    </View>
                </View>
                <View className="flex-1 ">
                    <FindSlots restaurant={restaurant} date={date} selectedNumber={selectedNumber} slotsData={slotsData} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Restaurant;