import { View, Text, TouchableOpacity, CodegenTypes } from 'react-native';
import React from 'react'

interface slectedNumberProps {
    selectedNumber: number;
    setSelectedNumber: (num: number) => void;
}
const GuestPickerComponent = ({ selectedNumber, setSelectedNumber }: slectedNumberProps) => {
    const decrement = () => {
        if (selectedNumber > 1) {
            setSelectedNumber(selectedNumber - 1);
        }
    }
    const increment = () => {
        if (selectedNumber < 12) {
            setSelectedNumber(selectedNumber + 1);
        }

    }
    return (
        <View className='flex flex-row justify-between items-center rounded-lg text-white text-base'>
            <TouchableOpacity onPress={decrement} className='rounded-lg'>
                <Text className='text-white text-lg font-semibold border border-[#f49b33] rounded-l-lg px-3 '>-</Text>
            </TouchableOpacity>
            <Text className='text-white text-lg px-3 font-semibold bg-[#474747] border border-[#474747]'>{selectedNumber}</Text>
            <TouchableOpacity onPress={increment} className='rounded-lg'>
                <Text className='text-white text-lg font-semibold border border-[#f49b33] rounded-r-lg px-3'>+</Text>
            </TouchableOpacity>
        </View>
    )
}

export default GuestPickerComponent