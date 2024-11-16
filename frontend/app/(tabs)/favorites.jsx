import React, { useState } from "react";
import { Text, SafeAreaView, FlatList, View } from "react-native";
import { FavouriteCard, EmptyState } from "../../components";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";

const Favorites = () => {
  const { favourites } = useGlobalContext();

  const handlePress = (item) => {
    // console.log("Food item pressed:", item);
    // Use Router to navigate to the ItemInfo screen, passing the item data
    router.push({
      pathname: "/item-info",
      params: {
        item: JSON.stringify(item), // Pass the item as a string
      },
    });
  };

  return (
    <SafeAreaView className="px-1 pt-9 bg-primary flex-1">
      <FlatList
        data={favourites}
        keyExtractor={(item) => item.$id} // Use the unique ID from Appwrite
        renderItem={({ item }) => (
          <FavouriteCard
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
        ListHeaderComponent={() => (
          <Text className="text-2xl font-psemibold text-white px-2 my-2">
            Favourites
          </Text>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Favourites is Empty"
            subtitle="No food items added to your favorites"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Favorites;
