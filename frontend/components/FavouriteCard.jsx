import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import AnimatedHeart from "./AnimatedHeart";

const FavouriteCard = ({ item, onPress }) => {
  // Convert price and quantity to numbers, using 0 as fallback if not valid
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View className="m-1 bg-tertiary rounded-xl shadow-md flex-row">
        <View className="flex-row justify-start items-center">
          {/* Food Image */}
          <Image
            source={{ uri: item.thumbnail }}
            className="h-[80] w-[20%] m-1 rounded-xl"
            resizeMode="cover"
          />
          {/* Food Item Name */}
          {/* Limit the meal name to 17 characters with ellipsis */}
          <Text
            className="text-[16px] font-semibold text-white w-[66%] px-2"
            numberOfLines={1} // Limit to one line
            ellipsizeMode="tail" // Show ellipsis at the end if truncated
          >
            {item.item_name.length > 30
              ? `${item.item_name.slice(0, 25)}...`
              : item.item_name}
          </Text>

          <View>
            <AnimatedHeart />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FavouriteCard;
