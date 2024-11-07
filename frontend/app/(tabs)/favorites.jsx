import React, { useState } from "react";
import { Text, SafeAreaView, FlatList, View } from "react-native";
import { FavouriteCard, EmptyState } from "../../components";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";


const meals_data = {
  meals: [
    {
      $id: "1",
      item_name: "Chicken Biryani",
      thumbnail:
        "https://t4.ftcdn.net/jpg/08/24/91/71/240_F_824917190_rfmzNyXz1kES6obVji2PxOXx5CLzQyfM.jpg",
      price: "10.99",
      strQty: "3",
    },
    {
      $id: "2",
      item_name: "Vegetable Sandwich",
      thumbnail:
        "https://t3.ftcdn.net/jpg/02/12/66/32/240_F_212663294_PPIXEQMJVZSiKlwMsPBMruuf4Fcctkn9.jpg",
      price: "5.99",
      strQty: "2",
    },
    {
      $id: "3",
      item_name: "Paneer Butter Masala",
      thumbnail:
        "https://t3.ftcdn.net/jpg/07/33/35/20/240_F_733352022_Xw1fn7F75GwU9d49iM2fzzayemx5BN1Z.jpg",
      price: "8.99",
      strQty: "1",
    },
    {
      $id: "4",
      item_name: "Margherita Pizza",
      thumbnail:
        "https://t3.ftcdn.net/jpg/08/21/43/70/240_F_821437091_fZVVfyqTd91FHEdZYhqZ64Jx7UHt6pXm.jpg",
      price: "12.99",
      strQty: "4",
    },
    {
      $id: "5",
      item_name: "Fried Rice",
      thumbnail:
        "https://t3.ftcdn.net/jpg/07/23/32/42/240_F_723324248_3IzXtewCSiPHxo2ox5Zz69MBkE51Pjps.jpg",
      price: "7.99",
      strQty: "2",
    },
  ],
};

const Favorites = () => {
  const { favourites } = useGlobalContext();

  const handlePress = (item) => {
    console.log(favourites);
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
        data={meals_data.meals}
        renderItem={({ item }) => (
          <FavouriteCard item={item} onPress={handlePress} />
        )}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={() => (
          <Text className="text-2xl font-psemibold text-white px-2 my-2">
            Favourites
          </Text>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Favourites is Empty"
            subtitle="No food items added to the favorites"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Favorites;
