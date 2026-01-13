import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';

const profile = () => {
    const auth = getAuth();
    const [userEmail, setUserEmail] = React.useState<string | null>(null);
    const handleLogout = async () => {
        try{
            await signOut(auth);
            await AsyncStorage.removeItem('userEmail');
            setUserEmail(null);
            Alert.alert("Logout Successful", "You have been logged out.");
            router.replace("/signin");
        }
        catch(error){
            Alert.alert("Logout Error:", "An error occurred during logout. Please try again.");
        }

    }
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
    return (
        <View className='flex-1 justify-center items-center bg-[#2b2b2b]'>
            <Text className='text-xl text-[#f49b33] font-semibold mb-4'>User Profile</Text>
            {
                userEmail ? (
                    <>
                        <Text className='text-white text-lg mb-6'>Email: {userEmail}</Text>
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="p-2 my-2 bg-[#f49b33] text-black rounded-lg"
                        >
                            <Text className="text-lg font-semibold text-center">Logout</Text>
                        </TouchableOpacity>
                    </>
                ) : (<>
                <TouchableOpacity
              onPress={() => router.push("/signup")}
              className="p-2 my-2 bg-[#f49b33] text-black rounded-lg"
            >
              <Text className="text-lg font-semibold text-center">Sign Up</Text>
            </TouchableOpacity>
                </>)
            }
        </View>
    )
}

export default profile