import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { updateUserCredentials } from "../../lib/appwrite"; // Import your email update function
import { useGlobalContext } from "../../context/GlobalProvider";
import { CustomButton } from "../../components";
import { MaterialIcons } from "@expo/vector-icons"; // Import icons for visibility toggle

const ChangeEmail = () => {
  const { user, setUser } = useGlobalContext(); // Access global user state
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter details, Step 2: Enter OTP
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle new password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Toggle current password visibility

  const validateEmail = (email) => {
    return email.endsWith("@gmail.com");
  };

  const handleSendOtp = () => {
    if (!newEmail || !newPassword || !currentPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (!validateEmail(newEmail)) {
      Alert.alert("Error", "Please enter a valid Gmail address.");
      return;
    }

    Alert.alert("OTP Sent", "A 6-digit OTP has been sent to your new email address.");
    setStep(2); // Proceed to OTP verification step
  };

  const handleVerifyOtp = async () => {
    if (!user) {
        return;
    }
    
    if (otp !== "123456") {
      Alert.alert("Error", "Invalid OTP. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      await updateUserCredentials(newEmail, newPassword, currentPassword, user?.$id);
      Alert.alert("Success", "Email updated successfully.");

      setUser((prevUser) => ({
        ...prevUser,
        email: newEmail,
      }));

      router.back();
      // Navigate back or update state as needed
    } catch (error) {
      console.error("Error updating email:", error);
      Alert.alert("Error", error.message || "Failed to update email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary px-2 pt-9">
      <Text className="text-2xl font-semibold text-white mb-6">Change Email</Text>

      {step === 1 && (
        <View>
          <Text className="text-gray-200 mb-2">New Email</Text>
          <TextInput
            className="bg-tertiary rounded-lg text-white text-lg p-3 mb-4 border-[.5px] border-gray-100"
            placeholder="Enter new Gmail address"
            placeholderTextColor="#606470"
            value={newEmail}
            onChangeText={setNewEmail}
          />

          <Text className="text-gray-200 mb-2">New Password</Text>
          <View className="relative">
            <TextInput
              className="bg-tertiary rounded-lg text-white text-lg p-3 mb-4 border-[.5px] border-gray-100"
              placeholder="Enter new password"
              placeholderTextColor="#606470"
              value={newPassword}
              secureTextEntry={!showNewPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-4"
            >
              <MaterialIcons
                name={showNewPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#606470"
              />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-200 mb-2">Current Password</Text>
          <View className="relative">
            <TextInput
              className="bg-tertiary rounded-lg text-white text-lg p-3 mb-4 border-[.5px] border-gray-100"
              placeholder="Enter current password"
              placeholderTextColor="#606470"
              value={currentPassword}
              secureTextEntry={!showCurrentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity
              onPress={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-3 top-4"
            >
              <MaterialIcons
                name={showCurrentPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#606470"
              />
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Send OTP"
            handlePress={handleSendOtp}
            isLoading={isLoading}
            containerStyles="mt-4"
          />
        </View>
      )}

      {step === 2 && (
        <View>
          <Text className="text-gray-200 mb-2">Enter OTP</Text>
          <TextInput
            className="bg-tertiary rounded-lg text-white text-lg p-3 mb-4 border-[.5px] border-gray-100"
            placeholder="Enter 6-digit OTP"
            placeholderTextColor="#606470"
            value={otp}
            keyboardType="numeric"
            maxLength={6}
            onChangeText={setOtp}
          />

          <CustomButton
            title="Verify OTP"
            handlePress={handleVerifyOtp}
            isLoading={isLoading}
            containerStyles="mt-4"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChangeEmail;
