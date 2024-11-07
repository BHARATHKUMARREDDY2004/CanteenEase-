import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import QuantitySelector from "./QuantitySelector"; // Custom Quantity Selector
import CustomButton from "./CustomButton"; // Custom Button
import Icon from "react-native-vector-icons/MaterialIcons";

const BottomSheet = ({ visible, onClose, item }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [price, setPrice] = useState(item?.price || 0);
  const [selectedAddons, setSelectedAddons] = useState([]); // State for selected add-ons
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setQuantity(1);
      if (item.sizes && item.sizes.length > 0) {
        setSelectedSize(item.sizes[0].size);
        setPrice(item.sizes[0].price);
      } else {
        setSelectedSize(null);
        setPrice(item.price || 0);
      }
      setSelectedAddons([]); // Reset selected addons when item changes
    }
  }, [item]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size.size);
    setPrice(size.price);
  };

  const handleAddonSelect = (addon) => {
    if (selectedAddons.includes(addon)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== addon)); // Deselect if already selected
    } else {
      setSelectedAddons([...selectedAddons, addon]); // Select the addon
    }
  };

  const submit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const totalPrice =
        price * quantity +
        selectedAddons.reduce((acc, addon) => acc + addon.price, 0);
      alert(
        `${item.item_name} added to cart with quantity ${quantity}, size ${
          selectedSize || "default"
        }, and add-ons: ${
          selectedAddons.map((a) => a.addon).join(", ") || "none"
        }`
      );
    } catch (error) {
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsLoading(false);
      onClose();
    }

    console.log(
      item.$id,
      quantity,
      selectedSize,
      selectedAddons,
      (
        price * quantity +
        selectedAddons.reduce((acc, addon) => acc + addon.price, 0)
      ).toFixed(2)
    );
  };

  if (!item) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
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
          {item.sizes?.length > 0 ? (
            <View className="my-4">
              <Text className="text-md font-semibold mb-2">Portion Size</Text>
              {item.sizes.map((size) => (
                <TouchableOpacity
                  key={size.size}
                  onPress={() => handleSizeSelect(size)}
                  disabled={isLoading}
                >
                  <View
                    className={`flex-row justify-between items-center p-2 rounded-lg border ${
                      selectedSize === size.size
                        ? "border-secondary"
                        : "border-gray-300"
                    }`}
                  >
                    <Text>{size.size}</Text>
                    <Text>₹{size.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text>Default size applied. No size options available.</Text>
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
                  onPress={() => handleAddonSelect(addon)}
                  disabled={isLoading}
                >
                  <View
                    className={`flex-row justify-between items-center p-2 rounded-lg border ${
                      selectedAddons.includes(addon)
                        ? "border-secondary"
                        : "border-gray-300"
                    }`}
                  >
                    <Text>{addon.addon}</Text>
                    <Text>₹{addon.price}</Text>
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
          <View className="w-[35%]">
            <QuantitySelector
              quantity={quantity}
              onIncrement={() => setQuantity(quantity + 1)}
              onDecrement={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              containerStyles="p-3 w-12"
              disabled={isLoading}
            />
          </View>

          {/* Custom Button for Add to Cart */}
          <CustomButton
            title={`Add item ₹${(
              price * quantity +
              selectedAddons.reduce((acc, addon) => acc + addon.price, 0)
            ).toFixed(2)}`}
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
