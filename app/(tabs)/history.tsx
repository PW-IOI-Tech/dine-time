import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

const history = () => {
    const [userEmail, setUserEmail] = React.useState<string | null>(null);
    const [booking, setBooking] = React.useState<Array<any>>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const router = useRouter();
    const db = getFirestore();
    React.useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const email = await AsyncStorage.getItem('userEmail');
                setUserEmail(email);
            } catch (error) {
                console.error("Error fetching user email:", error);
            }
        };
        fetchUserEmail();
    }, []);
    const fetchBookings = async () => {
            if (userEmail) {
                try {
                    const bookingCollection = collection(db, 'bookings');
                    const bookingQuery = query(bookingCollection, where('email', '==', userEmail));
                    const bookingSnapshot = await getDocs(bookingQuery);
                    const bookingsList: Array<any> = [];
                    bookingSnapshot.forEach((doc) => {
                        bookingsList.push({ id: doc.id, ...doc.data() });
                    });
                    setBooking(bookingsList);
                }
                catch (error) {
                    console.error("Error fetching bookings:", error);
                }
            }
             setLoading(false);
        };
    React.useEffect(() => {
        fetchBookings();
    }, [userEmail]);
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#2b2b2b] justify-center items-center">
                <Text className="text-white">Loading...</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-[#2b2b2b] justify-center items-center">
            {
                userEmail ? (
                    <FlatList onRefresh={fetchBookings} refreshing={loading} data={booking} keyExtractor={(item) => item.id} renderItem={({ item }) => (
                        <View className='w-full px-12 py-6 border border-[#fb9b33] rounded-lg mb-4'>
                            <Text className="text-white">Date:{item.date}</Text>
                            <Text className="text-white">Slot:{item.slot}</Text>
                            <Text className="text-white">Guests:{item.guests}</Text>
                            <Text className="text-white">Restaurant:{item?.restaurant}</Text>
                            <Text className="text-white">Email:{item.email}</Text>
                        </View>)}
                        contentContainerStyle={{ paddingBottom: 20 }} />
                ) : <View className='flex-1 justify-center items-center'>
                    <Text className="text-lg text-white ">Please Login to view your booking history</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/signin')}
                        className={`p-2 my-2 bg-[#f49b33] rounded-lg mt-10`}
                    >
                        <Text className="text-lg font-semibold text-center text-black">
                            Sign in
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        </SafeAreaView>
    )
}

export default history