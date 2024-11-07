import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, ScrollView } from "react-native";
import {
  CustomButton,
  AnimatedHeart,
  QuantitySelector,
} from "../../components"; // Import QuantitySelector
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

const ItemInfo = () => {
  const { params } = useRoute();
  const item = params?.item ? JSON.parse(params.item) : null;
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [isLoading, setIsLoading] = useState(false); // State for loading

  if (!item) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-lg text-red-500">
          Item details not available.
        </Text>
      </View>
    );
  }

  const submit = async () => {
    setIsLoading(true); // Show loading state

    try {
      // Add to cart logic here
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert(`${item.item_name} added to cart with quantity ${quantity}`);
    } catch (error) {
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Image Section */}
        <View className="p-2">
          {item.thumbnail ? (
            <Image
              source={{ uri: item.thumbnail }}
              className="w-full h-72 rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-72 bg-gray-100 rounded-xl justify-center items-center">
              <Text className="text-gray-500">No Image Available</Text>
            </View>
          )}
        </View>

        {/* Food Information */}
        <View className="px-2">
          <Text className="text-white text-2xl font-pbold mb-2">
            {item.item_name || "Item Name"}
          </Text>
          <Text className="text-secondary text-xl mb-4">
            {item.price ? `₹${item.price}` : "Price not available"}
          </Text>
          <Text className="text-gray-100 mb-6">
            {item.description || "No description available."}
          </Text>

          {/* Rating, Calories, and Time */}
          <View className="flex-row justify-between items-center mb-2 mr-2">
            <View className="flex-row items-center">
              <Icon name="store" size={25} color="yellow" />
              <Text className="text-white ml-2">
                {item.canteen || "Unknown"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <AnimatedHeart />
            </View>
          </View>
        </View>

        {/* Quantity and Add to Cart Section */}
        <View className="flex-row justify-evenly items-center my-1 px-2">
          <View className="w-[35%]">
            <QuantitySelector
              quantity={quantity}
              onIncrement={() => setQuantity(quantity + 1)} // Increase quantity
              onDecrement={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} // Decrease quantity
              containerStyles="p-3 w-12"
            />
          </View>

          {/* Custom Button for Add to Cart */}
          <CustomButton
            title={`Add item ₹${(item.price * quantity).toFixed(2)}`}
            handlePress={submit}
            containerStyles="w-[65%]"
            isLoading={isLoading} // Pass loading state to the button
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemInfo;
