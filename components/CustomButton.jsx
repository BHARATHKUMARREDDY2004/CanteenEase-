import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({
  title = "Button",  // Default title
  handlePress = () => {},  // Default press handler
  containerStyles = "",  // Additional container styles
  textStyles = "",  // Additional text styles
  isLoading = false,  // Loading state
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}  // Disable button while loading
    >
      {/* Button Title */}
      {!isLoading && (
        <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
          {title}
        </Text>
      )}

      {/* Show ActivityIndicator when loading */}
      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={{ marginLeft: 8 }}  // Adjust margin for alignment
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
