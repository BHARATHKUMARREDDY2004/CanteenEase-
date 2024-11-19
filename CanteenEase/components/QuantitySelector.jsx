import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const QuantitySelector = ({ quantity, onIncrement, onDecrement, containerStyles = "", quantityColor = "" }) => {
  return (
    <View className="flex-row items-center space-x-2">
      <TouchableOpacity
        className={`bg-gray-100 rounded-xl items-center ${containerStyles}`}
        onPress={onDecrement}
        disabled={quantity <= 1} // Disable if quantity is 1
      >
        <Text className="text-sm"><Icon name="remove" size={18} /></Text>
      </TouchableOpacity>
      <Text className= {`text-${quantityColor} text-lg`}>{quantity}</Text>
      <TouchableOpacity
        className={`bg-gray-100 rounded-xl items-center ${containerStyles}`}
        onPress={onIncrement}
      >
        <Text className="text-sm"><Icon name="add" size={18} /></Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuantitySelector;
