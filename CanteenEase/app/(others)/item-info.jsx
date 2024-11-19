import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { images } from "../../constants";
import { CustomButton, QuantitySelector } from "../../components";
import AnimatedHeart from "../../components/AnimatedHeart";
import { addToCart } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

export default function ItemInfo() {
  const { params } = useRoute();
  const item = params?.item ? JSON.parse(params.item) : null;
  const { user, cartItems, setCartItems } = useGlobalContext();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedSizePrice, setSelectedSizePrice] = useState(
    item?.selectedSizePrice || item?.price || 0
  );

  const [selectedAddons, setSelectedAddons] = useState([]);
  const [totalPrice, setTotalPrice] = useState(selectedSizePrice);

  useEffect(() => {
    if (item) {
      item.qty ? setQuantity(item.qty) : setQuantity(1);

      // Set selected size and price based on available options
      if (item.sizes && item.sizes.length > 0) {
        setSelectedSize(item.selectedSize || item.sizes[0]);
        setSelectedSizePrice(item.selectedSizePrice || item.prices[0]);
      } else {
        setSelectedSize(null);
        setSelectedSizePrice(item.selectedSizePrice || item.price || 0);
      }

      // Set selected addons if they exist
      item.selectedAddons
        ? setSelectedAddons(
            item.selectedAddons.map((addon, index) => ({
              addon: addon,
              price: item.selectedAddonPrices[index],
            })) || [] // Ensure it returns an empty array if no addons are selected
          )
        : setSelectedAddons([]);
    }
  }, [params.item]);

  useEffect(() => {
    const totalAddonsPrice = selectedAddons.reduce(
      (acc, addon) => acc + addon.price,
      0
    );
    const updatedTotal = selectedSizePrice * quantity + totalAddonsPrice;
    setTotalPrice(updatedTotal);
  }, [selectedSizePrice, selectedAddons, quantity]);

  const handleSizeSelect = (size, index) => {
    setSelectedSize(size);
    setSelectedSizePrice(item.prices[index]);
  };

  const handleAddonSelect = (addon, price) => {
    if (selectedAddons.some((a) => a.addon === addon)) {
      setSelectedAddons(selectedAddons.filter((a) => a.addon !== addon));
    } else {
      setSelectedAddons([...selectedAddons, { addon, price }]);
    }

    console.log(selectedAddons, item.selectedAddons, item.selectedAddonPrices);
  };

  const submit = async () => {
    setIsLoading(true);

    try {
      // Add the item to the server cart
      let newCartItem = await addToCart(
        user.$id,
        item.$id,
        selectedSizePrice,
        selectedSize,
        quantity,
        totalPrice,
        selectedAddons
      );

      newCartItem = {...item, ...newCartItem }

    // Optimistically add the item to the cart
    const updatedCartItems = [...cartItems, newCartItem];
    setCartItems(updatedCartItems);

      alert(`${item.item_name} added to cart`);
    } catch (error) {
      // On failure, remove the item that was optimistically added
      alert("Failed to add item to cart.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!item) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-lg text-red-500">
          Item details not available.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="p-2">
          <Image
            source={
              item.thumbnail ? { uri: item.thumbnail } : images.noImageAvailable
            }
            className="w-full h-72 rounded-xl bg-black/25"
            resizeMode="cover"
          />
        </View>

        <View className="px-2">
          <Text className="text-white text-2xl font-bold mb-2">
            {item.item_name || "Item Name"}
          </Text>
          <Text className="text-secondary text-xl mb-4">
            ₹{selectedSizePrice}
          </Text>
          <Text className="text-gray-100 mb-6">
            {item.description || "No description available."}
          </Text>

          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <Icon name="store" size={25} color="yellow" />
              <Text className="text-white ml-2">
                {item.canteen || "Unknown"}
              </Text>
            </View>
            <AnimatedHeart foodItemId={item.$id} />
          </View>
        </View>

        {item.sizes?.length > 0 && item.prices?.length > 0 ? (
          <View className="my-4 px-2">
            <Text className="text-md text-white font-semibold mb-2">
              Portion Size
            </Text>
            {item.sizes.map((size, index) => (
              <TouchableOpacity
                key={size}
                onPress={() => handleSizeSelect(size, index)}
                disabled={isLoading}
              >
                <View
                  className={`flex-row justify-between items-center p-2 rounded-lg border ${
                    selectedSize === size
                      ? "border-secondary"
                      : "border-tertiary"
                  } mb-1`}
                >
                  <Text className="text-gray-100">{size}</Text>
                  <Text className="text-gray-100">₹{item.prices[index]}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text className="px-2 text-gray-100">No size options available.</Text>
        )}

        {item.addons?.length > 0 ? (
          <View className="my-4 px-2">
            <Text className="text-md text-white font-semibold mb-2">
              Add-ons (Optional)
            </Text>
            {item.addons.map((addon, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  handleAddonSelect(addon, item.addon_prices[index])
                }
                disabled={isLoading}
              >
                <View
                  className={`flex-row justify-between items-center p-2 rounded-lg border ${
                    selectedAddons.some((a) => a.addon === addon)
                      ? "border-secondary"
                      : "border-tertiary"
                  } mb-1`}
                >
                  <Text className="text-gray-100">{addon}</Text>
                  <Text className="text-gray-100">
                    ₹{item.addon_prices[index]}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text className="px-2 text-gray-100">No add-ons available</Text>
        )}
      </ScrollView>

      <View className="flex-row justify-between items-center mt-4 px-4">
        <QuantitySelector
          quantity={quantity}
          onIncrement={() => setQuantity(quantity + 1)}
          onDecrement={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
          containerStyles="p-3 w-12"
          disabled={isLoading}
          quantityColor="white"
        />

        <CustomButton
          title={`Add item ₹${totalPrice.toFixed(2)}`}
          handlePress={submit}
          containerStyles="w-[65%]"
          isLoading={isLoading}
          disabled={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}
