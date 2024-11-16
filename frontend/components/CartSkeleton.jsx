import React from "react";
import { View, Animated, SafeAreaView, ScrollView } from "react-native";

const CartItemSkeleton = () => (
  <View className="m-1 bg-tertiary/50 rounded-xl p-2">
    <View className="flex-row">
      {/* Thumbnail skeleton */}
      <View className="w-[21%] h-[90px] bg-gray-600/30 rounded-xl animate-pulse" />
      
      {/* Content skeleton */}
      <View className="flex-1 ml-2 justify-between py-2">
        {/* Title skeleton */}
        <View className="h-5 w-3/4 bg-gray-600/30 rounded animate-pulse" />
        
        {/* Price skeletons */}
        <View className="h-4 w-1/2 bg-gray-600/30 rounded mt-2 animate-pulse" />
        <View className="h-4 w-2/3 bg-gray-600/30 rounded mt-2 animate-pulse" />
      </View>

      {/* Quantity selector skeleton */}
      <View className="absolute bottom-2 right-2 flex-row items-center">
        <View className="h-8 w-24 bg-gray-600/30 rounded animate-pulse" />
      </View>
    </View>
  </View>
);

const PriceDetailsSkeleton = () => (
  <View className="mt-auto">
    {/* Price summary skeleton */}
    <View className="px-4 py-2 bg-tertiary/50 rounded-lg mb-1">
      <View className="flex-row justify-between mb-2">
        <View className="h-4 w-1/3 bg-gray-600/30 rounded animate-pulse" />
        <View className="h-4 w-1/4 bg-gray-600/30 rounded animate-pulse" />
      </View>
      <View className="flex-row justify-between">
        <View className="h-4 w-1/2 bg-gray-600/30 rounded animate-pulse" />
        <View className="h-4 w-1/4 bg-gray-600/30 rounded animate-pulse" />
      </View>
    </View>

    {/* Bottom bar skeleton */}
    <View className="flex-row h-14">
      {/* Price and view details */}
      <View className="flex-row items-center justify-between px-4 bg-tertiary/50 rounded-l-lg w-[70%]">
        <View className="h-5 w-20 bg-gray-600/30 rounded animate-pulse" />
        <View className="h-4 w-24 bg-gray-600/30 rounded animate-pulse" />
      </View>
      
      {/* Continue button skeleton */}
      <View className="bg-secondary/50 rounded-r-lg w-[30%]" />
    </View>
  </View>
);

export default function CartSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-primary pt-9">
      {/* Header skeleton */}
      <View className="px-4 mb-4">
        <View className="h-8 w-20 bg-gray-600/30 rounded animate-pulse" />
      </View>

      {/* Cart items skeleton */}
      <ScrollView>
        <CartItemSkeleton />
        <CartItemSkeleton />
        <CartItemSkeleton />
      </ScrollView>

      {/* Price details skeleton */}
      <PriceDetailsSkeleton />
    </SafeAreaView>
  );
}