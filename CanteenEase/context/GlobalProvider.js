import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, fetchFavourites, addFavourite, removeFavourite, fetchFoodItemDetails } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setIsLogged(true);
          setUser(currentUser);

          const favData = await fetchFavourites(currentUser.$id);
          console.log(favData.length);
          setFavourites(favData || []);
        } else {
          setIsLogged(false);
          setUser(null);
          setFavourites([]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddFavourite = async (foodItemId) => {
    if (user && foodItemId) {
      try {
        // Optimistically update the UI
        const foodItem = await fetchFoodItemDetails(foodItemId);
        if (foodItem) {
          setFavourites((prevFavourites) => [...prevFavourites, foodItem]);
        }

        // Perform the backend operation
        await addFavourite(user.$id, foodItemId);
      } catch (error) {
        console.error("Error adding to favourites:", error.message);
        // Revert the optimistic update if the backend operation fails
        setFavourites((prevFavourites) => prevFavourites.filter((item) => item.$id !== foodItemId));
      }
    }
  };

  const handleRemoveFavourite = async (foodItemId) => {
    if (user && foodItemId) {
      try {
        // Optimistically update the UI
        setFavourites((prevFavourites) => prevFavourites.filter((item) => item.$id !== foodItemId));

        // Perform the backend operation
        await removeFavourite(user.$id, foodItemId);
      } catch (error) {
        console.error("Error removing from favourites:", error.message);
        // Revert the optimistic update if the backend operation fails
        const foodItem = await fetchFoodItemDetails(foodItemId);
        if (foodItem) {
          setFavourites((prevFavourites) => [...prevFavourites, foodItem]);
        }
      }
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        favourites,
        setFavourites,
        handleAddFavourite,
        handleRemoveFavourite,
        cartItems,
        setCartItems,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;