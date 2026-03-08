import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase';
import { Image } from 'expo-image';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const auth = getAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) return;
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUser(data);
        setName(data.name || '');
        setPhone(data.phone || '');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser!.uid), { name, phone });
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading) return <ActivityIndicator className="flex-1 justify-center" />;

  return (
    <View className="flex-1 p-6 bg-white">
      <View className="items-center mb-6">
        <Image 
            source={user?.avatarUrl || require('../../assets/images/placeholder.png')} 
            className="w-32 h-32 rounded-full mb-4" 
        />
        {editing ? (
          <>
            <TextInput value={name} onChangeText={setName} className="text-2xl font-bold border-b w-full text-center" />
            <TextInput value={phone} onChangeText={setPhone} className="text-lg text-gray-600 border-b w-full text-center mt-2" />
          </>
        ) : (
          <>
            <Text className="text-2xl font-bold">{name || 'Add your name'}</Text>
            <Text className="text-lg text-gray-600">{phone || 'Add your phone'}</Text>
          </>
        )}
        <Text className="text-sm text-gray-400 mt-2">{auth.currentUser?.email}</Text>
      </View>
      
      <TouchableOpacity 
        onPress={editing ? handleSave : () => setEditing(true)} 
        className="bg-blue-600 p-4 rounded-lg"
      >
        <Text className="text-white text-center font-bold">{editing ? 'Save Changes' : 'Edit Profile'}</Text>
      </TouchableOpacity>
    </View>
  );
}