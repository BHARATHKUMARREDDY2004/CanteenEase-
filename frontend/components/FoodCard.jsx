import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AnimatedHeart from "./AnimatedHeart";
import BottomSheet from "./BottomSheet"; // Import your BottomSheet component

const FoodCard = ({ item, onPress }) => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  // Function to handle the add icon press
  const handleAddPress = () => {
    setIsBottomSheetVisible(true);
  };

  // Function to close the bottom sheet
  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  return (
    <>
      <View className="m-2 bg-tertiary rounded-2xl shadow-md">
        {/* Tapping the whole card, except the add icon, will trigger onPress */}
        <TouchableOpacity onPress={() => onPress(item)}>
          <View>
            {/* Food Image */}
            {/* <Image
              source={{ uri: item.thumbnail }}
              className={`w-full ${item.thumbnail ? 'h-40' : 'h-20'} rounded-t-2xl`}
              resizeMode="cover"
            /> */}
            {item.thumbnail ? (
              <Image
                source={{ uri: item.thumbnail }}
                className="w-full h-40 rounded-t-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-40 bg-gray-100 rounded-xl justify-center items-center">
                <Text className="text-gray-500">No Image Available</Text>
              </View>
            )}
            <View className="bg-dim_white rounded-full absolute top-2 right-2">
              <AnimatedHeart />
            </View>
          </View>
        </TouchableOpacity>

        {/* Food Information */}
        <View className="flex-row justify-between items-center px-2">
          {/* Tapping text will trigger onPress */}
          <TouchableOpacity
            onPress={() => onPress(item)}
            style={{ flex: 0.95 }}
          >
            <View className="flex-col justify-between items-start pr-4 py-2">
              <Text
                className="text-[16px] font-semibold text-white"
                numberOfLines={1} // Limit to one line
                ellipsizeMode="tail" // Show ellipsis at the end if truncated
              >
                {item.item_name.length > 17
                  ? `${item.item_name.slice(0, 17)}...`
                  : item.item_name}
              </Text>
              <Text className="text-gray-100 text-sm pr-5">
                Starting From ₹{item.price}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Add to cart icon */}
          <TouchableOpacity onPress={handleAddPress}>
            <View
              className="bg-secondary p-2 rounded-md"
              style={{ flex: 0.05 }}
            >
              <Icon name="add" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* BottomSheet that only shows when the add icon is pressed */}
      <BottomSheet
        visible={isBottomSheetVisible}
        onClose={handleCloseBottomSheet}
        item={item}
      />
    </>
  );
};

export default FoodCard;

// import React from 'react';
// import { View, Text, Image, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AnimatedHeart from './AnimatedHeart'

// const FoodCard = ({ item, onPress }) => {
//   return (
//     <View className="m-2 bg-tertiary rounded-2xl shadow-md">
//       <TouchableOpacity onPress={() => onPress(item)}>
//         <View>
//           {/* Food Image */}
//           <Image
//             source={{ uri: item.thumbnail }}
//             className="w-full h-40 rounded-t-2xl"
//             resizeMode="cover"
//           />
//           <View className="bg-dim_white rounded-full absolute top-2 right-2">
//             <AnimatedHeart />
//           </View>
//         </View>
//       </TouchableOpacity>

//       {/* Food Information */}
//       <View className="flex-row justify-between items-center px-2">
//       <TouchableOpacity onPress={() => onPress(item)} style={{ flex: 0.95 }}>
//         <View className="flex-col justify-between items-start pr-4 py-2">
//           {/* Limit the meal name to 17 characters with ellipsis */}
//           <Text
//             className="text-[16px] font-semibold text-white"
//             numberOfLines={1} // Limit to one line
//             ellipsizeMode="tail" // Show ellipsis at the end if truncated
//           >
//             {item.item_name.length > 17 ? `${item.item_name.slice(0, 17)}...` : item.item_name}
//           </Text>
//           <Text className="text-gray-100 text-sm pr-5">
//             Starting From ₹{item.price}
//           </Text>
//         </View>
//         </TouchableOpacity>
//         {/* Add to cart icon */}
//         <View className="bg-secondary p-2 rounded-md" style={{ flex: 0.05 }}>
//           <Icon name="add" size={20} color="white" />
//         </View>

//       </View>
//     </View>
//   );
// };

// export default FoodCard;

// import React from "react";
// import { Image, Text, TouchableOpacity, View } from "react-native";

// const FoodCard = ({ item, onPress }) => {
//   return (
//     <TouchableOpacity onPress={() => onPress(item)}>
//       <View className="mr-4 bg-white rounded-lg shadow-lg p-3">
//         <Image
//           source={{ uri: item.thumbnail }}
//           className="w-72 h-40 rounded-lg"
//           resizeMode="cover"
//         />
//         <Text className="text-black font-psemibold mt-2">{item.item_name}</Text>
//         <Text className="text-gray-700">Starting From {item.price}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default FoodCard;
