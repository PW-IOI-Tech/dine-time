import { View, Text, TouchableOpacity, Platform } from 'react-native';
import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerComponentProps {
  date: Date;
  setDate: (date: Date) => void;
}

const DatePickerComponent = ({ date, setDate }: DatePickerComponentProps) => {
  const [show, setShow] = React.useState(false);

  const handlePress = () => {
    setShow(true);
  };

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') {
      setShow(false);
    }
    setDate(currentDate);
  };

  return (
    <View className="flex flex-row">
      {Platform.OS === 'android' && (
        <View>
          <TouchableOpacity 
            onPress={handlePress} 
            className="px-2 py-1 justify-center bg-[#474747] rounded-lg"
          >
            <Text className="text-white">{date.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
              minimumDate={new Date()}
              maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
            />
          )}
        </View>
      )}
      {Platform.OS === 'ios' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default" 
          onChange={onChange}
          minimumDate={new Date()}
          maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
          themeVariant="dark"
          style={{ transform: [{ scale: 1 }] }} 
        />
      )}
    </View>
  );
};

export default DatePickerComponent;