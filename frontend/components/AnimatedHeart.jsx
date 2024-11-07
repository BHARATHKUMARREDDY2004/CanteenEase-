import React, { useState, useRef } from "react";
import { TouchableWithoutFeedback, Animated, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const AnimatedHeart = () => {
  const [liked, setLiked] = useState(false); // To track whether it's liked
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    setLiked(!liked); // Toggle liked state

    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.5, // Scale up
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1, // Scale back to original
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View className="justify-center items-center h-10 w-10">
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <Icon
            name={liked ? "favorite" : "favorite-border"}
            size={25}
            color={liked ? "#ff347f" : "grey"}
          />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AnimatedHeart;
