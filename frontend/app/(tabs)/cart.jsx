// import React, { useEffect, useState } from "react";
// import {
//   Text,
//   SafeAreaView,
//   FlatList,
//   View,
//   TouchableOpacity,
// } from "react-native";
// import { CartCard, EmptyState, Loader } from "../../components";
// import { router } from "expo-router";
// import {fetchCartItems, deleteCartItem } from "../../lib/appwrite"
// import { useGlobalContext } from "../../context/GlobalProvider";

// const Cart = () => {
//   const { user, cartItems, setCartItems } = useGlobalContext();
//   const [showPriceDetails, setShowPriceDetails] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     setIsLoading(true);
//     fetchCartItems(user.$id).then(([foodItemDetails, cartItems]) => {
//       if (!Array.isArray(cartItems) || cartItems.length === 0) {
//         console.log("No cart items found");
//         setCartItems([]); // Set an empty array if cartItems is not an array or empty
//         return;
//       }

//       // Ensure foodItemDetails is an array as well
//       if (!Array.isArray(foodItemDetails)) {
//         console.error("Food item details is not an array:", foodItemDetails);
//         setCartItems([]); // Set an empty array if foodItemDetails is not an array
//         return;
//       }

//       // console.log(cartItems)
//       // console.log(foodItemDetails)

//       // Merge food item details with cart items
//       const mergedCartItems = cartItems.map((cartItem) => {
//         const foodItem = foodItemDetails.find(
//           (item) => item.$id === cartItem.itemId
//         );

//         if (foodItem) {
//           return {
//             ...foodItem,
//             ...cartItem,
//           };
//         } else {
//           return cartItem;
//         }
//       });
//       setCartItems(mergedCartItems);
//     }).catch((error) => {
//       console.error("Error fetching cart items:", error);
//       setCartItems([]); // Optionally, you can also handle the error state here

//     }).finally(() => {
//       setIsLoading(false);
//     });
//   }, [user.$id]);

//   const calculatePriceDetails = () => {
//     let MRP = 0;
//     let discount = 0;
//     let deliveryFee = 0;

//     cartItems.forEach((item) => {
//       MRP += parseFloat(item.selectedSizePrice) * parseInt(item.qty) + item.selectedAddonPrices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
//     });

//     discount = MRP * 0.0; // Example fixed discount
//     const totalAmount = MRP - discount + deliveryFee;

//     return { MRP, discount, deliveryFee, totalAmount };
//   };

//   const priceDetails = calculatePriceDetails();

//   const handleRemoveItem = async (itemId) => {
//     try {
//       // Optimistically update the cart items on the frontend
//       const updatedCartItems = cartItems.filter((item) => item.$id !== itemId);
//       setCartItems(updatedCartItems);

//       // Make a backend request to remove the item from the database
//       await deleteCartItem(itemId);

//       alert("Item removed from cart successfully!");
//     } catch (error) {
//       // Handle any errors and revert the optimistic update if needed
//       console.error("Failed to remove item:", error);
//       alert("Failed to remove item from cart.");

//       // Revert the change in the frontend
//       setCartItems(cartItems);
//     }
//   };

//   const handleUpdateQuantity = (itemId, operation) => {
//     const updatedCartItems = cartItems.map((item) => {
//       if (item.$id === itemId) {
//         const updatedQty =
//           operation === "increment" ? item.qty + 1 : item.qty - 1;
//         return { ...item, qty: updatedQty < 1 ? 1 : updatedQty }; // Ensure quantity doesn't go below 1
//       }
//       return item;
//     });
//     setCartItems(updatedCartItems);
//   };

//   return (
//     <SafeAreaView className="px-1 pt-9 bg-primary flex-1">
//       <Loader isLoading={isLoading} />
//       <FlatList
//         data={cartItems}
//         renderItem={({ item }) => (
//           <CartCard
//             item={{
//               $id: item.$id,
//               item_name: item.item_name,
//               price: item.price,
//               qty: item.qty,
//               canteen: item.canteen, // Canteen name
//               description: item.description, // Description
//               selectedSizePrice: item.selectedSizePrice,
//               selectedAddons: item.selectedAddons,
//               selectedAddonPrices: item.selectedAddonPrices,
//               selectedSize: item.selectedSize,
//               sizes: item.sizes,
//               prices: item.prices,
//               addons: item.addons,
//               addon_prices : item.addon_prices, // Default to an empty array if no addons exist
//               thumbnail: item.thumbnail, // Fallback if no thumbnail
//               totalPrice: item.totalPrice,
//             }}
//             onRemove={() => handleRemoveItem(item.$id)}
//             onUpdateQuantity={handleUpdateQuantity}
//           />
//         )}
//         keyExtractor={(item) => item.$id}
//         ListHeaderComponent={() => (
//           <Text className="text-2xl font-psemibold text-white px-2 my-2">
//             Cart
//           </Text>
//         )}
//         ListEmptyComponent={() => (
//           <EmptyState
//             title="Cart is Empty"
//             subtitle="No food items added to the cart"
//           />
//         )}
//       />

//       {cartItems.length > 0 && ( // Only show price details if there are items in the cart
//         <View>
//           {showPriceDetails && (
//             <View className="px-4 py-2 bg-tertiary rounded-lg">
//               <View className="flex-row justify-between">
//                 <Text className="text-gray-100">
//                   MRP ({cartItems.length} items):
//                 </Text>
//                 <Text className="text-gray-100">
//                   ₹{priceDetails.MRP.toFixed(2)}
//                 </Text>
//               </View>
//               <View className="flex-row justify-between">
//                 <Text className="text-gray-100">Product Discount:</Text>
//                 <Text className="text-green-400">
//                   - ₹{priceDetails.discount.toFixed(2)}
//                 </Text>
//               </View>
//               <View className="flex-row justify-between">
//                 <Text className="text-gray-100">Delivery Fee:</Text>
//                 <Text className="text-gray-100">
//                   ₹{priceDetails.deliveryFee.toFixed(2)}
//                 </Text>
//               </View>
//               <View className="flex-row justify-between">
//                 <Text className="text-gray-100">Total Amount:</Text>
//                 <Text className="text-gray-100">
//                   ₹{priceDetails.totalAmount.toFixed(2)}
//                 </Text>
//               </View>
//             </View>
//           )}

//           {/* Price Details Section */}
//           <View className="flex-row my-0.5">
//             <View className="flex-row items-center justify-between px-4 bg-tertiary rounded-l-lg w-[70%]">
//               <Text className="text-lg text-white font-semibold">
//                 ₹{priceDetails.totalAmount.toFixed(2)}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setShowPriceDetails(!showPriceDetails)}
//                 className="w-[60%] items-end"
//               >
//                 <Text className="text-sm text-gray-100">
//                   View price details
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* Continue Button */}
//             <TouchableOpacity
//               className="bg-secondary rounded-r-lg py-3 w-[30%]"
//               onPress={() => router.push("/payment")}
//             >
//               <Text className="text-center text-white text-lg font-bold">
//                 Continue
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default Cart;

import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";
import { CartCard, EmptyState, Loader } from "../../components";
import { router } from "expo-router";
import { fetchCartItems, deleteCartItem } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import CartSkeleton from "../../components/CartSkeleton"; // Import the CartSkeleton

const Cart = () => {
  const { user, cartItems, setCartItems } = useGlobalContext();
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initially loading is true

  useEffect(() => {
    if(!user){
      return;
    }
    setIsLoading(true);
    fetchCartItems(user.$id)
      .then(([foodItemDetails, cartItems]) => {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
          console.log("No cart items found");
          setCartItems([]); // Set an empty array if cartItems is not an array or empty
          return;
        }

        // Ensure foodItemDetails is an array as well
        if (!Array.isArray(foodItemDetails)) {
          console.error("Food item details is not an array:", foodItemDetails);
          setCartItems([]); // Set an empty array if foodItemDetails is not an array
          return;
        }

        // Merge food item details with cart items
        const mergedCartItems = cartItems.map((cartItem) => {
          const foodItem = foodItemDetails.find(
            (item) => item.$id === cartItem.itemId
          );

          if (foodItem) {
            return {
              ...foodItem,
              ...cartItem,
            };
          } else {
            return cartItem;
          }
        });
        setCartItems(mergedCartItems);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setCartItems([]); // Optionally, you can also handle the error state here
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);

  const calculatePriceDetails = () => {
    let MRP = 0;
    let discount = 0;
    let deliveryFee = 0;

    cartItems.forEach((item) => {
      MRP +=
        parseFloat(item.selectedSizePrice) * parseInt(item.qty) +
        item.selectedAddonPrices.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
    });

    discount = MRP * 0.0; // Example fixed discount
    const totalAmount = MRP - discount + deliveryFee;

    return { MRP, discount, deliveryFee, totalAmount };
  };

  const priceDetails = calculatePriceDetails();

  const handleRemoveItem = async (itemId) => {
    try {
      // Optimistically update the cart items on the frontend
      const updatedCartItems = cartItems.filter((item) => item.$id !== itemId);
      setCartItems(updatedCartItems);

      // Make a backend request to remove the item from the database
      await deleteCartItem(itemId);

      alert("Item removed from cart successfully!");
    } catch (error) {
      // Handle any errors and revert the optimistic update if needed
      console.error("Failed to remove item:", error);
      alert("Failed to remove item from cart.");

      // Revert the change in the frontend
      setCartItems(cartItems);
    }
  };

  const handleUpdateQuantity = (itemId, operation) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.$id === itemId) {
        const updatedQty =
          operation === "increment" ? item.qty + 1 : item.qty - 1;
        return { ...item, qty: updatedQty < 1 ? 1 : updatedQty }; // Ensure quantity doesn't go below 1
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  return (
    <SafeAreaView className="px-1 pt-9 bg-primary flex-1">
      {/* <Loader isLoading={isLoading} /> */}

      {/* Show the CartSkeleton while loading */}
      {isLoading ? (
        <CartSkeleton />
      ) : (
        <FlatList
          data={cartItems}
          renderItem={({ item }) => (
            <CartCard
              item={{
                $id: item.$id,
                item_name: item.item_name,
                price: item.price,
                qty: item.qty,
                canteen: item.canteen, // Canteen name
                description: item.description, // Description
                selectedSizePrice: item.selectedSizePrice,
                selectedAddons: item.selectedAddons,
                selectedAddonPrices: item.selectedAddonPrices,
                selectedSize: item.selectedSize,
                sizes: item.sizes,
                prices: item.prices,
                addons: item.addons,
                addon_prices: item.addon_prices, // Default to an empty array if no addons exist
                thumbnail: item.thumbnail, // Fallback if no thumbnail
                totalPrice: item.totalPrice,
              }}
              onRemove={() => handleRemoveItem(item.$id)}
              onUpdateQuantity={handleUpdateQuantity}
            />
          )}
          keyExtractor={(item) => item.$id}
          ListHeaderComponent={() => (
            <Text className="text-2xl font-psemibold text-white px-2 my-2">
              Cart
            </Text>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="Cart is Empty"
              subtitle="No food items added to the cart"
            />
          )}
        />
      )}

      {cartItems.length > 0 && ( // Only show price details if there are items in the cart
        <View>
          {showPriceDetails && (
            <View className="px-4 py-2 bg-tertiary rounded-lg">
              <View className="flex-row justify-between">
                <Text className="text-gray-100">
                  MRP ({cartItems.length} items):
                </Text>
                <Text className="text-gray-100">
                  ₹{priceDetails.MRP.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-100">Product Discount:</Text>
                <Text className="text-green-400">
                  - ₹{priceDetails.discount.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-100">Delivery Fee:</Text>
                <Text className="text-gray-100">
                  ₹{priceDetails.deliveryFee.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-100">Total Amount:</Text>
                <Text className="text-gray-100">
                  ₹{priceDetails.totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {/* Price Details Section */}
          <View className="flex-row my-0.5">
            <View className="flex-row items-center justify-between px-4 bg-tertiary rounded-l-lg w-[70%]">
              <Text className="text-lg text-white font-semibold">
                ₹{priceDetails.totalAmount.toFixed(2)}
              </Text>
              <TouchableOpacity
                onPress={() => setShowPriceDetails(!showPriceDetails)}
                className="w-[60%] items-end"
              >
                <Text className="text-sm text-gray-100">
                  View price details
                </Text>
              </TouchableOpacity>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              className="bg-secondary rounded-r-lg py-3 w-[30%]"
              onPress={() => router.push("/payment")}
            >
              <Text className="text-center text-white text-lg font-bold">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;
