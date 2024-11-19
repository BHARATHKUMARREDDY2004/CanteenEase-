import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

const CustomAlert = ({ visible, onClose, title, message }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="w-72 p-5 bg-primary rounded-xl items-center shadow-lg">
          <Text className="text-lg font-bold text-[#F5C518] mb-2">{title}</Text>
          <Text className="text-base text-white text-center mb-5">{message}</Text>
          <TouchableOpacity
            className="bg-[#F5C518] px-5 py-2 rounded-lg"
            onPress={onClose}
          >
            <Text className="text-black font-bold text-base">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
