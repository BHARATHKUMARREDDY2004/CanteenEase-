import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, fetchFavourites, addFavourite, removeFavourite } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState([]); // Store favourites globally as list of food item documents

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setIsLogged(true);
          setUser(currentUser);
          
          // Fetch the user's favourites when they are logged in
          const favData = await fetchFavourites(currentUser.$id);
          setFavourites(favData || []); // Initialize favourites with full food item documents
        } else {
          setIsLogged(false);
          setUser(null);
          setFavourites([]); // Reset favourites if the user is not logged in
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Function to add an item to the favourites
  const handleAddFavourite = async (foodItemId) => {
    if (user && foodItemId) {
      try {
        const updatedFavourites = await addFavourite(user.$id, foodItemId);
        setFavourites(updatedFavourites); // Update the global state with the full food item documents
      } catch (error) {
        console.log("Error adding to favourites:", error.message);
      }
    }
  };

  // Function to remove an item from the favourites
  const handleRemoveFavourite = async (foodItemId) => {
    if (user && foodItemId) {
      try {
        const updatedFavourites = await removeFavourite(user.$id, foodItemId);
        setFavourites(updatedFavourites); // Update the global state with the full food item documents
      } catch (error) {
        console.log("Error removing from favourites:", error.message);
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
        favourites, // Expose the full food item documents globally
        handleAddFavourite, // Add to favourites
        handleRemoveFavourite, // Remove from favourites
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;



// import React, { createContext, useContext, useEffect, useState } from "react";
// import { getCurrentUser } from "../lib/appwrite";

// const GlobalContext = createContext();
// export const useGlobalContext = () => useContext(GlobalContext);

// const GlobalProvider = ({ children }) => {
//   const [isLogged, setIsLogged] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getCurrentUser()
//       .then((res) => {
//         if (res) {
//           setIsLogged(true);
//           setUser(res);
//         } else {
//           setIsLogged(false);
//           setUser(null);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <GlobalContext.Provider
//       value={{
//         isLogged,
//         setIsLogged,
//         user,
//         setUser,   // Make sure setUser is available to update user info globally
//         loading,
//       }}
//     >
//       {children}
//     </GlobalContext.Provider>
//   );
// };

// export default GlobalProvider;