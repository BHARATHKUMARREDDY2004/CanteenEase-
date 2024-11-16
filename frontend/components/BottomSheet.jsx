import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import QuantitySelector from "./QuantitySelector"; // Custom Quantity Selector
import CustomButton from "./CustomButton"; // Custom Button
import Icon from "react-native-vector-icons/MaterialIcons";
import { addToCart } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const BottomSheet = ({ visible, onClose, item }) => {
  const { user, cartItems, setCartItems } = useGlobalContext();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedSizePrice, setSelectedSizePrice] = useState(item?.price || 0);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [totalPrice, setTotalPrice] = useState(selectedSizePrice);

  useEffect(() => {
    if (item) {
      setQuantity(1);
      if (item.sizes && item.sizes.length > 0) {
        setSelectedSize(item.sizes[0]);
        setSelectedSizePrice(item.prices[0]); // Assuming price corresponds to sizes
      } else {
        setSelectedSize(null);
        setSelectedSizePrice(item.price || 0);
      }
      setSelectedAddons([]); // Reset selected addons when item changes
    }
  }, [item]);

  useEffect(() => {
    const totalAddonsPrice = selectedAddons.reduce(
      (acc, addon) => acc + addon.price,
      0
    );
    const updatedTotal = selectedSizePrice * quantity + totalAddonsPrice;
    setTotalPrice(updatedTotal);
  }, [selectedSize, selectedAddons, quantity]);

  const handleSizeSelect = (size, index) => {
    setSelectedSize(size);
    setSelectedSizePrice(item.prices[index]); // Update price based on selected size
  };

  const handleAddonSelect = (addon, price) => {
    if (selectedAddons.some((a) => a.addon === addon)) {
      setSelectedAddons(selectedAddons.filter((a) => a.addon !== addon)); // Deselect if already selected
    } else {
      setSelectedAddons([...selectedAddons, { addon, price }]); // Select the addon
    }
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

  if (!item) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/60">
          {/* Empty View to cover the backdrop */}
        </View>
      </TouchableWithoutFeedback>

      <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-lg">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold">{item.item_name}</Text>
          <TouchableOpacity onPress={onClose} disabled={isLoading}>
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {/* Portion Size */}
          {item.sizes?.length > 0 && item.prices?.length > 0 ? (
            <View className="my-4">
              <Text className="text-md font-semibold mb-2">Portion Size</Text>
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
                        : "border-gray-300"
                    } mb-1`}
                  >
                    <Text>{size}</Text>
                    <Text>₹{item.prices[index]}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text className="px-2">
              Default size applied. No size options available.
            </Text>
          )}

          {/* Add-ons */}
          {item.addons?.length > 0 ? (
            <View className="my-4">
              <Text className="text-md font-semibold mb-2">
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
                        : "border-gray-300"
                    } mb-1`}
                  >
                    <Text>{addon}</Text>
                    <Text>₹{item.addon_prices[index]}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text>No add-ons available</Text>
          )}
        </ScrollView>

        {/* Quantity and Add to Cart Section */}
        <View className="flex-row justify-between items-center mt-4">
          <QuantitySelector
            quantity={quantity}
            onIncrement={() => setQuantity(quantity + 1)}
            onDecrement={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            containerStyles="p-3 w-12"
            disabled={isLoading}
          />

          {/* Custom Button for Add to Cart */}
          <CustomButton
            title={`Add item ₹${totalPrice.toFixed(2)}`}
            handlePress={submit}
            containerStyles="w-[65%]"
            isLoading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </Modal>
  );
};

export default BottomSheet;
