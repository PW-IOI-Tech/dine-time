import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { restaurants } from '@/store/restaurants';
import { Formik } from 'formik';
import validationSchema from '@/utils/guestformSchema';
import Ionicons from '@expo/vector-icons/Ionicons';
interface FindSlotsProps {
    slotsData: Array<any>;
    selectedSlot: string | null;
    setSelectedSlot: (slot: string | null) => void;
    date: Date;
    selectedNumber: number;
    restaurant: string | string[];
}
const FindSlots = ({
    slotsData,
    selectedSlot,
    setSelectedSlot,
    date,
    selectedNumber,
    restaurant
}: FindSlotsProps) => {
    const [slotsVisible, setSlotsVisible] = React.useState<boolean>(false);
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [formVisible, setFormVisible] = React.useState<boolean>(false);
    const handleSlotPress = (slot: any) => {
        let prevSlot = selectedSlot;
        if (prevSlot == slot) {
            setSelectedSlot(null);
        } else {
            setSelectedSlot(slot);
        }
    };
    const handleFormSubmit = async(values: any) => {
       try {
                await addDoc(collection(db, "bookings"), {
                    ...values,
                    slot: selectedSlot,
                    date: date.toISOString(),
                    guests: selectedNumber,
                    createdAt: new Date(),
                    restaurant: restaurant
                })
                alert("Booking Successful!");
                 setModalVisible(false);

            }
            catch (error) {
                console.error("Booking Error:", error);
            }
    }

    const handleBooking = async () => {
        const userEmail = await AsyncStorage.getItem('userEmail');
        const guestStatus = await AsyncStorage.getItem('isGuest');
        if (userEmail) {
            try {
                await addDoc(collection(db, "bookings"), {
                    email: userEmail,
                    slot: selectedSlot,
                    date: date.toISOString(),
                    guests: selectedNumber,
                    createdAt: new Date(),
                    restaurant: restaurant
                })
                alert("Booking Successful!");

            }
            catch (error) {
                console.error("Booking Error:", error);
            }
        }
        else if (guestStatus === "true") {
            setFormVisible(true);
            setModalVisible(true);
        }
    }
    const handleCloseModal = () => {
        setModalVisible(false);
        setFormVisible(false);
    }
    return (
        <View className="flex-1">
            <View className={`flex ${selectedSlot != null ? 'flex-row' : ''}`}>
                <View className={`${selectedSlot != null && "flex-1"}`}>
                    <TouchableOpacity onPress={() => setSlotsVisible(!slotsVisible)}>
                        <Text className="text-white text-center text-lg font-semibold bg-[#f49b33] p-2 my-3 mx-2 rounded-lg">
                            Available Slots
                        </Text>
                    </TouchableOpacity>
                </View>
                {selectedSlot != null && (
                    <View className="flex-1">
                        <TouchableOpacity onPress={handleBooking}>
                            <Text className="text-white text-center text-lg font-semibold bg-[#f49b33] p-2 my-3 mx-2 rounded-lg">
                                Book Slots
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {slotsVisible && (
                <View className="flex-wrap flex-row mx-2 p-2 bg-[#474747] rounded-lg">
                    {slotsData.map((slot, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`m-2 p-4 bg-[#f49b33] rounded-lg items-center justify-center ${selectedSlot && selectedSlot !== slot ? "opacity-50" : ""
                                }`}
                            onPress={() => handleSlotPress(slot)}
                            disabled={
                                selectedSlot == slot || selectedSlot == null ? false : true
                            }
                        >
                            <Text className="text-white font-bold">{slot}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <Modal visible={modalVisible} transparent={true} animationType="slide" style={{
                flex: 1,
                justifyContent: 'flex-end',
                margin: 0,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }} >
                <View className="flex-1 bg-[#00000080] justify-end">
                    <View className='bg-[#474747] mx-4 rounded-t-lg p-4 pb-6'>
                        {
                            formVisible && (
                                <Formik
                                    initialValues={{ fullName: "", phoneNumber: "" }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleFormSubmit}
                                >
                                    {({
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        values,
                                        errors,
                                        touched,
                                        isSubmitting,
                                    }) => (
                                        <View className="w-full">
                                            <View>
                                                <Ionicons
                                                    name="close"
                                                    size={30}
                                                    color={"#f49b33"}
                                                    onPress={handleCloseModal}
                                                />
                                            </View>

                                            <Text className="text-[#f49b33] mt-4 mb-2">Name</Text>
                                            <TextInput
                                                className="h-10 border border-white text-white rounded px-2"
                                                autoCapitalize="none"
                                                onChangeText={handleChange("fullName")}
                                                value={values.fullName}
                                                onBlur={handleBlur("fullName")}
                                            />
                                            {touched.fullName && errors.fullName && (
                                                <Text className="text-red-500 text-xs mb-2">{errors.fullName}</Text>
                                            )}

                                            <Text className="text-[#f49b33] mt-4 mb-2">Phone Number</Text>
                                            <TextInput
                                                className="h-10 border border-white text-white rounded px-2"
                                                keyboardType="phone-pad"
                                                onChangeText={handleChange("phoneNumber")}
                                                value={values.phoneNumber}
                                                onBlur={handleBlur("phoneNumber")}
                                            />
                                            {touched.phoneNumber && errors.phoneNumber && (
                                                <Text className="text-red-500 text-xs mb-2">
                                                    {errors.phoneNumber}
                                                </Text>
                                            )}

                                            <TouchableOpacity
                                                onPress={() => handleSubmit()}
                                                disabled={isSubmitting}
                                                className={`p-2 my-2 bg-[#f49b33] rounded-lg mt-10 ${isSubmitting ? "opacity-50" : ""
                                                    }`}
                                            >
                                                <Text className="text-lg font-semibold text-center text-black">
                                                    {isSubmitting ? "Submitting..." : "Submit"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </Formik>
                            )
                        }
                    </View>
                </View>
            </Modal>
        </View>
    );
};
export default FindSlots;