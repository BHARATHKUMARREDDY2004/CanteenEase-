import React, { useRef, useCallback, useMemo, useState, useEffect } from "react";
import { TouchableWithoutFeedback, Animated, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useGlobalContext } from "../context/GlobalProvider";

const AnimatedHeart = ({ item }) => {
  const { favourites, handleAddFavourite, handleRemoveFavourite } =
    useGlobalContext();

  // Check if the food item is already in the global favourites list
  const isFavorite = useMemo(
    () => favourites.some((foodItem) => foodItem.$id === item.$id),
    [favourites, item.$id]
  );

  const scaleValue = useRef(new Animated.Value(1)).current;

  const animateHeart = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleValue]);

  const handlePress = useCallback(() => {
    animateHeart();

    if (isFavorite) {
      handleRemoveFavourite(item);
    } else {
      handleAddFavourite(item);
    }
  }, [
    isFavorite,
    item,
    handleAddFavourite,
    handleRemoveFavourite,
    animateHeart,
  ]);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View className="justify-center items-center h-10 w-10">
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <Icon
            name={isFavorite ? "favorite" : "favorite-border"}
            size={25}
            color={isFavorite ? "#ff347f" : "grey"}
          />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AnimatedHeart;