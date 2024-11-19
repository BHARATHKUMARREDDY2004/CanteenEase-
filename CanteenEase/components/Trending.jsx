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
          sizes: item.sizes,
          prices: item.prices,
          addons: item.addons,
          addon_prices : item.addon_prices, // Default to an empty array if no addons exist
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
