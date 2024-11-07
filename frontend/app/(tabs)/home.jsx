import { useState, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { images } from "../../constants";
import { EmptyState, SearchInput, Trending, FoodCard } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { fetchFoodItems } from "../../lib/appwrite";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useGlobalContext();
  const [foodItems, setFoodItems] = useState([]);

  // Fetch food items when the component mounts
  useEffect(() => {
    const getFoodItems = async () => {
      try {
        const items = await fetchFoodItems();
        setFoodItems(items); // Store the fetched food items
      } catch (error) {
        console.error("Failed to fetch food items:", error.message);
      }
    };

    getFoodItems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

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
    <SafeAreaView className="bg-primary">
      <FlatList
        data={foodItems} // Use the fetched food items here
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
        ListHeaderComponent={() => (
          <View className="flex my-6 px-2 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />

            <View className="w-full flex-1">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Today's Special Items
              </Text>
              <Trending foodItems={foodItems} handlePress={handlePress} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Food Items Found"
            subtitle="No food items posted yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
