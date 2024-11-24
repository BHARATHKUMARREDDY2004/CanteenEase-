import { SafeAreaView, Text, View, Image, TextInput, Alert, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Loader } from "../../components"
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserName, updateUserNameInAuth } from "../../lib/appwrite";
import { router } from "expo-router"; // Import router from expo-router

const PersonalInfo = () => {
  const { user, setUser } = useGlobalContext(); // Access and set global user state
  const [name, setName] = useState(user?.username);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    setName(user?.username);
  }, [user]);

  // Helper function to capitalize the first letter of the username
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Debounced function to handle name and avatar change
  const handleNameChangeDebounced = useCallback(
    (newName) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      const timeoutId = setTimeout(async () => {
        setIsLoading(true);
        try {
          // Capitalize the first letter of the new name
          const capitalizedNewName = capitalizeFirstLetter(newName);

          // Update the name in the Appwrite authentication system (Auth)
          await updateUserNameInAuth(capitalizedNewName);

          // Call the updateUserName function to update the user's name and avatar in the database
          const updatedUser = await updateUserName(user?.$id, capitalizedNewName);

          // Update global user state to reflect changes (username and avatar)
          setUser((prevUser) => ({
            ...prevUser,
            username: updatedUser.username,
            avatar: updatedUser.avatar, // Ensure the avatar is updated with the new initials
          }));

          Alert.alert("Success", "Your name and avatar have been updated successfully.");
        } catch (error) {
          console.log(error);
          Alert.alert("Error", "Failed to update the name and avatar.");
        }finally{
          setIsLoading(false);
        }
      }, 500); // Debounce for 500ms

      setDebounceTimeout(timeoutId);
    },
    [debounceTimeout, user?.$id, setUser]
  );

  // Handle the name change on blur (when user leaves the input field)
  const handleNameBlur = () => {
    if (name !== user?.username) {
      handleNameChangeDebounced(name);
    }
  };

  // Handle navigation to the Change Email screen
  const handleEmailChangePress = () => {
    router.push({
      pathname: "/change-email", // Path to the Change Email screen
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-primary px-2 pt-9">
      {/* Header */}
      <Text className="text-2xl font-semibold text-white my-2">Personal Info</Text>
      <Loader isLoading={isLoading} />

      {/* Container for centering the image */}
      <View className="flex-1 justify-start items-center mt-4">
        <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
          <Image
            source={{ uri: user?.avatar }} // Avatar dynamically updates with the new initials
            className="w-[90%] h-[90%] rounded-lg"
            resizeMode="cover"
          />
        </View>

        {/* Name Input Field */}
        <View className="mt-10 w-full">
          <View className="mb-4">
            <Text className="text-gray-200 mb-1 text-base font-pregular">Name</Text>
            <View className="bg-tertiary rounded-lg border-[.5px] border-gray-100 p-3">
              <TextInput
                value={name}
                onChangeText={setName}
                className="text-white text-lg font-pregular"
                onBlur={handleNameBlur}
              />
            </View>
          </View>
          <View className="mb-4">
  <Text className="text-gray-200 mb-1 text-base font-pregular">Email</Text>
  <View className="bg-tertiary rounded-lg border-[.5px] border-gray-100 p-3 flex-row items-center">
    <Text 
      className="text-white text-lg font-pregular flex-1" 
      numberOfLines={1} 
      ellipsizeMode="tail"
    >
      {user?.email}
    </Text>
    <TouchableOpacity onPress={handleEmailChangePress}>
      <Text className="text-secondary font-pregular">CHANGE</Text>
    </TouchableOpacity>
  </View>
</View>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default PersonalInfo;
