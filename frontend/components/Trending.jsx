import React from "react";
import { FlatList } from "react-native";
import FoodCard from "./FoodCard";

const Trending = ({ foodItems, handlePress }) => {
  return (
    <FlatList
      data={foodItems}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.$id} // Use the unique ID from Appwrite
      renderItem={({ item }) => (
        <FoodCard
          item={{
            $id: item.$id, // Unique ID from Appwrite
            item_name: item.item_name, // Food name
            canteen: item.canteen, // Canteen name
            description: item.description, // Description
            price: item.price, // Default price
            sizes: item.sizes.map((size, index) => ({
              size, // Food size
              price: item.prices[index], // Corresponding price
            })),
            addons: item.addons
              ? item.addons.map((addon, index) => ({
                  addon, // Addon name
                  price: item.addon_prices[index], // Corresponding price
                }))
              : [], // Default to an empty array if no addons exist
            thumbnail: item.thumbnail, // Fallback if no thumbnail
          }}
          onPress={handlePress}
        />
      )}
      getItemLayout={(foodItems, index) => ({
        length: 304, // The width of each item (image width + margin)
        offset: 304 * index, // Calculating the offset based on the width
        index,
      })}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      removeClippedSubviews={true}
    />
  );
};

export default Trending;
