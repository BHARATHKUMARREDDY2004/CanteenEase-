import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import QuantitySelector from "./QuantitySelector"; // Import QuantitySelector

const CartCard = ({ item, onRemove, onUpdateQuantity }) => {
  const price = parseFloat(item.price);
  const quantity = item.strQty;

  return (
    <View className="m-1 bg-tertiary rounded-xl shadow-md">
      {/* Remove item button */}
      <TouchableOpacity onPress={onRemove} className="absolute top-2 right-2">
        <Icon name="remove" size={20} color="white" />
      </TouchableOpacity>
      <View className="flex-row">
        {/* Food Image */}
        <Image
          source={{ uri: item.thumbnail }}
          className="w-[20%] m-1 rounded-xl"
          resizeMode="cover"
        />
        {/* Food Information */}
        <View className="flex-col justify-between items-start py-4 px-1 w-[50%]">
          <Text
            className="text-[16px] font-semibold text-white"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.item_name.length > 17
              ? `${item.item_name.slice(0, 20)}...`
              : item.item_name}
          </Text>
          <Text className="text-gray-100 text-sm pr-5">
            Price: ₹{item.price}
          </Text>
          <Text className="text-gray-100 text-sm pr-5">
            Total Price: ₹{(price * quantity).toFixed(2)}
          </Text>
        </View>

        {/* Quantity Section */}
        <View className="absolute bottom-2 right-2">
          <QuantitySelector
            quantity={quantity}
            onIncrement={() => onUpdateQuantity(item.$id, "increment")}
            onDecrement={() => onUpdateQuantity(item.$id, "decrement")}
            containerStyles="p-1.5 w-9"
          />
        </View>
      </View>
    </View>
  );
};

export default CartCard;

// import React from 'react';
// import { View, Text, Image, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const CartCard = ({ item, onRemove, onUpdateQuantity }) => {
//   const price = parseFloat(item.price);
//   const quantity = item.strQty;
//   const totalPrice = (price * quantity).toFixed(2);

//   return (
//     <View className="m-1 bg-tertiary rounded-xl shadow-md">
//       {/* Remove item button */}
//       <TouchableOpacity onPress={onRemove}>
//         <Icon name="remove" size={20} color="white" style={{ position: 'absolute', top: 10, right: 10 }} />
//       </TouchableOpacity>
//       <View className="flex-row">
//         {/* Food Image */}
//         <Image
//           source={{ uri: item.thumbnail }}
//           className="w-[20%] m-1 rounded-xl"
//           resizeMode="cover"
//         />
//         {/* Food Information */}
//         <View className="flex-col justify-between items-start py-4 px-1 w-[50%]">
//           <Text
//             className="text-[16px] font-semibold text-white"
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             {item.item_name.length > 17 ? `${item.item_name.slice(0, 20)}...` : item.item_name}
//           </Text>
//           <Text className="text-gray-100 text-sm pr-5">Price: ₹{item.price}</Text>
//           <Text className="text-gray-100 text-sm pr-5">Total Price: ₹{totalPrice}</Text>
//         </View>

//         {/* Quantity Section */}
//         <View className="flex-row items-center space-x-2 absolute bottom-2 right-2">
//           <TouchableOpacity
//             className="bg-gray-200 rounded-xl p-1.5 w-9 items-center"
//             onPress={() => onUpdateQuantity(item.$id, "decrement")}
//             disabled={quantity <= 1} // Disable if quantity is 1
//           >
//             <Text className="text-sm"><Icon name="remove" size={18} /></Text>
//           </TouchableOpacity>
//           <Text className="text-white text-lg">{quantity}</Text>
//           <TouchableOpacity
//             className="bg-gray-200 rounded-xl p-1.5 w-9 items-center"
//             onPress={() => onUpdateQuantity(item.$id, "increment")}
//           >
//             <Text className="text-sm"><Icon name="add" size={18} /></Text>
//           </TouchableOpacity>
//         </View>
//         {/* Quantity Sections */}
//       </View>
//     </View>
//   );
// };

// export default CartCard;

// import React from 'react';
// import { View, Text, Image, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const CartCard = ({ item, onRemove }) => {
//     // Convert price and quantity to numbers, using 0 as fallback if not valid
//     const price = parseFloat(item.price);
//     const quantity = parseInt(item.strQty);
//     const totalPrice = (price * quantity).toFixed(2);

//     return (
//       <View className="m-1 bg-tertiary rounded-xl shadow-md">
//         {/* Remove item button */}
//         <TouchableOpacity onPress={onRemove}>
//           <Icon name="remove" size={20} color="white" style={{ position: 'absolute', top: 10, right: 10}} />
//         </TouchableOpacity>
//         <View className="flex-row">
//           {/* Food Image */}
//           <Image
//             source={{ uri: item.thumbnail }}
//             className="w-[20%] m-1 rounded-xl"
//             resizeMode="cover"
//           />
//           {/* Food Information */}
//           <View className="flex-col justify-between items-start py-4 px-1 w-[50%]">
//             {/* Limit the meal name to 17 characters with ellipsis */}
//             <Text
//               className="text-[16px] font-semibold text-white"
//               numberOfLines={1} // Limit to one line
//               ellipsizeMode="tail" // Show ellipsis at the end if truncated
//             >
//               {item.item_name.length > 17 ? `${item.item_name.slice(0, 20)}...` : item.item_name}
//             </Text>
//             <Text className="text-gray-100 text-sm pr-5">
//               Price: {item.price}
//             </Text>
//             <Text className="text-gray-100 text-sm pr-5">
//               Total Price: ₹{totalPrice}
//             </Text>
//           </View>

//             <View className="flex-row items-center space-x-2 absolute bottom-2 right-2">
//               <TouchableOpacity className="bg-gray-200 rounded-xl p-1.5 w-9 items-center">
//                 <Text className="text-sm"><Icon name="remove" size={18}/></Text>
//               </TouchableOpacity>
//               <Text className="text-white text-lg">{quantity}</Text>
//               <TouchableOpacity className="bg-gray-200 rounded-xl p-1.5 w-9 items-center">
//                 <Text className="text-sm"><Icon name="add" size={18}/></Text>
//               </TouchableOpacity>
//             </View>

//         </View>
//       </View>
//     );
//   };

// export default CartCard;
