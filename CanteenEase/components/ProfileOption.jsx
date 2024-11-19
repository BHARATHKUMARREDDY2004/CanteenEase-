import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const ProfileOption = ({ label, iconName, route }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(route)}
      className="flex-row items-center justify-between p-2 rounded-lg m-1 border-[.5px] border-tertiary"
    >
      <View className="flex-row items-center">
        <Icon name={iconName} size={24} color="#ffffff" style={{ marginRight: 16 }} />
        <Text className="text-white text-lg font-medium">{label}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#ffffff" />
    </TouchableOpacity>
  );
};

export default ProfileOption;
