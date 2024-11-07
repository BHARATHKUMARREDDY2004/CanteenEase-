import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";
import { CartCard, EmptyState } from "../../components";
import { router } from "expo-router";

const meals_data = {
  meals: [
    {
      $id: "1",
      item_name: "Chicken Biryani",
      thumbnail:
        "https://t4.ftcdn.net/jpg/08/24/91/71/240_F_824917190_rfmzNyXz1kES6obVji2PxOXx5CLzQyfM.jpg",
      price: 10.99,
      strQty: 3,
    },
    {
      $id: "2",
      item_name: "Vegetable Sandwich",
      thumbnail:
        "https://t3.ftcdn.net/jpg/02/12/66/32/240_F_212663294_PPIXEQMJVZSiKlwMsPBMruuf4Fcctkn9.jpg",
      price: 5.99,
      strQty: 2,
    },
    {
      $id: "3",
      item_name: "Paneer Butter Masala",
      thumbnail:
        "https://t3.ftcdn.net/jpg/07/33/35/20/240_F_733352022_Xw1fn7F75GwU9d49iM2fzzayemx5BN1Z.jpg",
      price: 8.99,
      strQty: 11,
    },
    {
      $id: "4",
      item_name: "Margherita Pizza",
      thumbnail:
        "https://t3.ftcdn.net/jpg/08/21/43/70/240_F_821437091_fZVVfyqTd91FHEdZYhqZ64Jx7UHt6pXm.jpg",
      price: 12.99,
      strQty: 4,
    },
    {
      $id: "5",
      item_name: "Fried Rice",
      thumbnail:
        "https://t3.ftcdn.net/jpg/07/23/32/42/240_F_723324248_3IzXtewCSiPHxo2ox5Zz69MBkE51Pjps.jpg",
      price: 7.99,
      strQty: 2,
    },
  ],
};

const Cart = () => {
  const [cartItems, setCartItems] = useState(meals_data.meals);
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  const calculatePriceDetails = () => {
    let MRP = 0;
    let discount = 0;
    let deliveryFee = 19; // Example delivery fee

    cartItems.forEach((item) => {
      MRP += parseFloat(item.price) * parseInt(item.strQty);
    });

    discount = MRP * 0.0; // Example fixed discount
    const totalAmount = MRP - discount + deliveryFee;

    return { MRP, discount, deliveryFee, totalAmount };
  };

  const priceDetails = calculatePriceDetails();

  const handleRemoveItem = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.$id !== itemId);
    setCartItems(updatedCartItems);
  };

  const handleUpdateQuantity = (itemId, operation) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.$id === itemId) {
        const updatedQty =
          operation === "increment" ? item.strQty + 1 : item.strQty - 1;
        return { ...item, strQty: updatedQty < 1 ? 1 : updatedQty }; // Ensure quantity doesn't go below 1
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  return (
    <SafeAreaView className="px-1 pt-9 bg-primary flex-1">
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartCard
            item={item}
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

// import React, { useState } from "react";
// import {
//   Text,
//   SafeAreaView,
//   FlatList,
//   View,
//   TouchableOpacity,
// } from "react-native";
// import { CartCard, EmptyState } from "../../components";
// import { router } from "expo-router";

// const meals_data = {
//   meals: [
//     {
//       $id: "1",
//       item_name: "Chicken Biryani",
//       thumbnail:
//         "https://t4.ftcdn.net/jpg/08/24/91/71/240_F_824917190_rfmzNyXz1kES6obVji2PxOXx5CLzQyfM.jpg",
//       price: "10.99",
//       strQty: "3",
//     },
//     {
//       $id: "2",
//       item_name: "Vegetable Sandwich",
//       thumbnail:
//         "https://t3.ftcdn.net/jpg/02/12/66/32/240_F_212663294_PPIXEQMJVZSiKlwMsPBMruuf4Fcctkn9.jpg",
//       price: "5.99",
//       strQty: "2",
//     },
//     {
//       $id: "3",
//       item_name: "Paneer Butter Masala",
//       thumbnail:
//         "https://t3.ftcdn.net/jpg/07/33/35/20/240_F_733352022_Xw1fn7F75GwU9d49iM2fzzayemx5BN1Z.jpg",
//       price: "8.99",
//       strQty: "11",
//     },
//     {
//       $id: "4",
//       item_name: "Margherita Pizza",
//       thumbnail:
//         "https://t3.ftcdn.net/jpg/08/21/43/70/240_F_821437091_fZVVfyqTd91FHEdZYhqZ64Jx7UHt6pXm.jpg",
//       price: "12.99",
//       strQty: "4",
//     },
//     {
//       $id: "5",
//       item_name: "Fried Rice",
//       thumbnail:
//         "https://t3.ftcdn.net/jpg/07/23/32/42/240_F_723324248_3IzXtewCSiPHxo2ox5Zz69MBkE51Pjps.jpg",
//       price: "7.99",
//       strQty: "2",
//     },
//   ],
// };

// const Cart = () => {
//   const [cartItems, setCartItems] = useState(meals_data.meals);

//   const [showPriceDetails, setShowPriceDetails] = useState(false);

//   // Function to calculate the total MRP and other price details
//   const calculatePriceDetails = () => {
//     let MRP = 0;
//     let discount = 0; // Example discount, adjust as needed
//     let deliveryFee = 19; // Example delivery fee, adjust as needed

//     cartItems.forEach((item) => {
//       MRP += parseFloat(item.price) * parseInt(item.strQty);
//     });

//     // Assuming a fixed discount for simplicity, you can modify as per your logic
//     discount = MRP * 0.3; // 30% discount for example

//     const totalAmount = MRP - discount + deliveryFee;

//     return { MRP, discount, deliveryFee, totalAmount };
//   };

//   const priceDetails = calculatePriceDetails();

//   const handleRemoveItem = (itemId) => {
//     const updatedCartItems = cartItems.filter((item) => item.$id !== itemId);
//     setCartItems(updatedCartItems);
//   };

//   return (
//     <SafeAreaView className="px-1 pt-9 bg-primary flex-1">
//       <FlatList
//         data={cartItems}
//         renderItem={({ item }) => (
//           <CartCard
//             item={item}
//             onRemove={() => handleRemoveItem(item.$id)}
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

//       <View>
//         {showPriceDetails && (
//           <View className="px-4 py-2 bg-tertiary rounded-lg">
//             <View className="flex-row justify-between">
//               <Text className="text-gray-100">
//                 MRP ({cartItems.length} items):
//               </Text>
//               <Text className="text-gray-100">
//                 ₹{priceDetails.MRP.toFixed(2)}
//               </Text>
//             </View>
//             <View className="flex-row justify-between">
//               <Text className="text-gray-100">Product Discount:</Text>
//               <Text className="text-green-400">
//                 - ₹{priceDetails.discount.toFixed(2)}
//               </Text>
//             </View>
//             <View className="flex-row justify-between">
//               <Text className="text-gray-100">Delivery Fee:</Text>
//               <Text className="text-gray-100">
//                 ₹{priceDetails.deliveryFee.toFixed(2)}
//               </Text>
//             </View>
//             <View className="flex-row justify-between">
//               <Text className="text-gray-100">Total Amount:</Text>
//               <Text className="text-gray-100">
//                 ₹{priceDetails.totalAmount.toFixed(2)}
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* Price Details Section */}
//         <View className="flex-row my-0.5">
//           <View className="flex-row items-center justify-between px-4 bg-tertiary rounded-l-lg w-[70%]">
//             <Text className="text-lg text-white font-semibold">
//               ₹{priceDetails.totalAmount.toFixed(2)}
//             </Text>
//             <TouchableOpacity
//               onPress={() => setShowPriceDetails(!showPriceDetails)}
//               className="w-[60%] items-end"
//             >
//               <Text className="text-sm text-gray-100">View price details</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Continue Button */}
//           <TouchableOpacity
//             className="bg-secondary rounded-r-lg py-3 w-[30%]"
//             onPress={() => router.push("/payment")}
//           >
//             <Text className="text-center text-white text-lg font-bold">
//               Continue
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Cart;

// import { Text } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const Cart = () => {
//   return (
//     <SafeAreaView className="px-4 my-6 bg-primary h-full">
//       <Text className="text-2xl text-white font-psemibold">Cart</Text>
//     </SafeAreaView>
//   );
// };

// export default Cart;
