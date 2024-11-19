import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, FlatList, TouchableOpacity, Image, Text } from "react-native";
import { useState } from "react";

import { signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { ProfileOption, Loader } from "../../components";
import { icons } from "../../constants";

// Profile options data
const profileOptions = [
  { label: 'Personal Information', route: '/personal-info', iconName: 'person' },
  { label: 'Your Orders', route: '/orders', iconName: 'shopping-bag' },
  { label: 'About', route: '/about', iconName: 'info' },
  { label: 'Send Feedback', route: '/feedback', iconName: 'feedback' },
  { label: 'Settings', route: '/settings', iconName: 'settings' },
];

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false); // State to control loader visibility

  const logout = async () => {
    setIsLoading(true); // Show loader

    try {
      await signOut();
      setUser(null);
      setIsLogged(false);
      router.replace("/sign-in");
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Logout failed. Please try again.'); // Handle errors if needed
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* Loader Component */}
      <Loader isLoading={isLoading} />

      {/* FlatList for Profile Options */}
      <FlatList
        data={profileOptions}
        keyExtractor={(item, index) => index.toString()}  // Use index as the key
        renderItem={({ item }) => (
          <ProfileOption
            label={item.label}
            route={item.route}
            iconName={item.iconName}
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center my-6 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            {/* User Avatar */}
            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center mt-10">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <Text className="text-white text-lg text-center font-psemibold mt-4">{user?.username}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
