import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import QuantitySelector from "./QuantitySelector"; // Import QuantitySelector
import { images } from "../constants";
import { router } from "expo-router";


const CartCard = ({ item, onRemove, onUpdateQuantity }) => {
  const price = item.selectedSizePrice;
  const quantity = item.qty;
  const addon_prices = item.selectedAddonPrices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  // Function to log the item name when image or info is pressed
  const handlePress = () => {
    // Use Router to navigate to the ItemInfo screen, passing the item data
    router.push({
      pathname: "/item-info",
      params: {
        item: JSON.stringify(item), // Pass the item as a string
      },
    });
  };

  return (
    <View className="m-1 bg-tertiary rounded-xl shadow-md">
      {/* Remove item button */}
      <TouchableOpacity onPress={onRemove} className="absolute top-2 right-2">
        <Icon name="delete" size={25} color="#ff6666" />
      </TouchableOpacity>

      <View className="flex-row">
        {/* Touchable wrapper for image and food info */}
        <TouchableOpacity onPress={handlePress} className="flex-row w-[70%]">
          {/* Food Image */}
          <Image
            source={
              item.thumbnail ? { uri: item.thumbnail } : images.noImageAvailable
            }
            className="w-[30%] m-1 rounded-xl"
            resizeMode="cover"
            style={{ height: 90 }} 
          />
          {/* Food Information */}
          <View className="flex-col justify-between items-start py-4 px-1 w-[70%]">
            <Text
              className="text-[16px] font-semibold text-white"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.item_name.length > 20
                ? `${item.item_name.slice(0, 20)}...`
                : item.item_name}
            </Text>
            <Text className="text-gray-100 text-sm pr-5">
              Price: ₹{price} + add-ons
            </Text>
            <Text className="text-gray-100 text-sm pr-5">
              Total Price: ₹{(price * quantity + addon_prices * quantity).toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Quantity Section */}
        <View className="absolute bottom-2 right-2">
          <QuantitySelector
            quantity={quantity}
            onIncrement={() => onUpdateQuantity(item.$id, "increment")}
            onDecrement={() => onUpdateQuantity(item.$id, "decrement")}
            containerStyles="p-1.5 w-9"
            quantityColor="white"
          />
        </View>
      </View>
    </View>
  );
};

export default CartCard;