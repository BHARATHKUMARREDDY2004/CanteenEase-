import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const Settings = () => {
  return (
    <SafeAreaView className="px-4 pt-9 bg-primary flex-1">
      {/* Header */}
      <Text className="text-2xl font-psemibold text-white mb-6">Settings</Text>

      {/* Setting Options */}
      <TouchableOpacity className="mb-4">
        <Text className="text-lg font-pmedium text-white">Add a Place</Text>
        <Text className="text-sm font-plight text-gray-100">
          In case we're missing something
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="mb-4">
        <Text className="text-lg font-pmedium text-white">Places you’ve added</Text>
        <Text className="text-sm font-plight text-gray-100">
          See all the places you’ve added so far
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="mb-4" onPress={() => router.push('/personal-info')}>
        <Text className="text-lg font-pmedium text-white">Edit profile</Text>
        <Text className="text-sm font-plight text-gray-100">
          Change your name, email, and phone number
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="mb-4">
        <Text className="text-lg font-pmedium text-white">Notification settings</Text>
        <Text className="text-sm font-plight text-gray-100">
          Define what alerts and notifications you want to see
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="mb-4">
        <Text className="text-lg font-pmedium text-white">Account settings</Text>
        <Text className="text-sm font-plight text-gray-100">Delete your account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;
