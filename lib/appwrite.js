import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.CanteenEase.CanteenEase",
  projectId: "671668af034f2f", 
  databaseId: "67166c20000783c",
  userCollectionId: "6716200e9e12b",
  foodItemsCollectionID: "65ee001f53f9",
  favouritesCollectionID: "672b7ca1ba932221",
  cartCollectionID: "6735b8260",
  feedbackCollectionID: "6422001a00f2",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
// --------------------------------------------------------------------------------------
// User Account Functions
// --------------------------------------------------------------------------------------

// Register user and create an account
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error("Account creation failed.");

    // Create avatar using initials
    const avatarUrl = avatars.getInitials(username[0]);
    
    // Sign in after registration
    await signIn(email, password);

    // Store user in the database collection
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    // Create an empty favourites document for the new user
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.favouritesCollectionID,
      newUser.$id,
      { favourites: [] }  // Empty array for favourites
    );

    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Sign in user
export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get current account
export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get current user details from the database based on account ID
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No active session found.");

    // Query to fetch user details from the database collection
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    
    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error("User not found in the database.");
    }
    
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign out user
export async function signOut() {
  try {
    await account.deleteSession("current");
  } catch (error) {
    throw new Error(error.message);
  }
}

// --------------------------------------------------------------------------------------
// Update User Functions
// --------------------------------------------------------------------------------------

// Update the user's name in the Appwrite authentication system (Auth)
export async function updateUserNameInAuth(newName) {
  try {
    const updatedAuthUser = await account.updateName(newName);
    return updatedAuthUser;
  } catch (error) {
    throw new Error(error.message);
  }
}


// Update the user's name and avatar in the Appwrite database
export async function updateUserName(userId, newName) {
  try {
    // Capitalize the first letter of the new name
    const capitalizedNewName = newName.charAt(0).toUpperCase() + newName.slice(1);

    // Generate new avatar URL using only the first letter of the name
    const firstLetterAvatar = avatars.getInitials(capitalizedNewName.charAt(0));

    // Update the user document with new name and new avatar
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        username: capitalizedNewName,
        avatar: firstLetterAvatar,  // Only the first letter as avatar
      }
    );

    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
}


// Function to update user's email
export async function updateUserEmail(newEmail, password, userId) {
  try {
    // Update the email in authentication (Appwrite Auth)
    await account.updateEmail(newEmail, password);

    // Update the email in the users collection (Appwrite Database)
        const updatedEmail = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        email: newEmail, // Only the first letter as avatar
      }
    );

    return { success: true, message: "Email updated successfully in both Auth and Users collection" };
  } catch (error) {
    console.error("Error updating email:", error);
    throw new Error(error.message);
  }
}

// Function to update user's password
export async function updateUserPassword(newPassword, oldPassword) {
  try {
    await account.updatePassword(newPassword, oldPassword);
    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error(error.message);
  }
}

// Function to update both email and password
export async function updateUserCredentials(newEmail, newPassword, currentPassword, userId) {
  try {
    // Update email first
    await updateUserEmail(newEmail, currentPassword, userId);
    
    // Then update password
    await updateUserPassword(newPassword, currentPassword);
    
    return { success: true, message: "Email and password updated successfully in Auth and Users collection" };
  } catch (error) {
    console.error("Error updating credentials:", error);
    throw new Error(error.message);
  }
}




// --------------------------------------------------------------------------------------
// Fetching Food Items Functions
// --------------------------------------------------------------------------------------
// Fetch food items from the food items collection
export async function fetchFoodItems() {
  try {
    const foodItems = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.foodItemsCollectionID
    );
    return foodItems.documents; // Return the documents containing food items
  } catch (error) {
    throw new Error(error.message);
  }
}


// --------------------------------------------------------------------------------------
// Favourite Management Functions
// --------------------------------------------------------------------------------------

// Fetch the user's favourites by userId
export async function fetchFavourites(userId) {
  try {
    // Fetch the user's favourite document from the favourites collection
    const favouriteItems = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.favouritesCollectionID,
      [Query.equal('$id', userId)]  // Querying by userId
    );

    if (favouriteItems.documents.length === 0) {
      console.log("No favourites found for this user.");
      return [];
    }

    // Now fetch the details of each food item in the favourites array
    const foodItemDetails = await Promise.all(
      favouriteItems.documents[0].favourites.map(async (foodItemId) => {
        return await fetchFoodItemDetails(foodItemId); // Fetch the full details of the food item
      })
    );

    return foodItemDetails;
  } catch (error) {
    throw new Error(error.message);
  }
}


// Add a food item to the user's favourites
export async function addFavourite(userId, foodItemId) {
  try {
    const favouriteDoc = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.favouritesCollectionID,
      [Query.equal('$id', userId)]  // Querying by userId
    );

    if (!favouriteDoc) throw new Error("No favourite document found.");

    // Add the new food item ID to the favourites array
    const updatedFavourites = [...favouriteDoc.documents[0].favourites, foodItemId];

    // Update the document in the database
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.favouritesCollectionID,
      userId,
      { favourites: updatedFavourites }
    );

    console.log("Food item added to favourites.");
  } catch (error) {
    throw new Error(error.message);
  }
}

// Remove a food item from the user's favourites
export async function removeFavourite(userId, foodItemId) {
  try {
    const favouriteDoc = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.favouritesCollectionID,
      [Query.equal('$id', userId)]  // Querying by userId
    );

    if (!favouriteDoc) throw new Error("No favourite document found.");

    // Filter out the food item ID to remove
    const updatedFavourites = favouriteDoc.documents[0].favourites.filter(
      (id) => id !== foodItemId
    );

    // Update the document in the database
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.favouritesCollectionID,
      userId,
      { favourites: updatedFavourites }
    );
    console.log("Food item removed from favourites.");
  } catch (error) {
    throw new Error(error.message);
  }
}

// Fetch the details of a food item by ID
export async function fetchFoodItemDetails(foodItemId) {
  try {
    const foodItem = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.foodItemsCollectionID,
      foodItemId
    );
    return foodItem;
  } catch (error) {
    console.log("Error fetching food item details:", error.message);
  }
}



// --------------------------------------------------------------------------------------
// File Management Functions
// --------------------------------------------------------------------------------------

// Upload file to storage
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get file preview based on type (image/video)
export async function getFilePreview(fileId, type) {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type.");
    }

    if (!fileUrl) throw Error("File preview generation failed.");
    return fileUrl;
  } catch (error) {
    throw new Error(error.message);
  }
}


// --------------------------------------------------------------------------------------
// Cart Management Functions
// --------------------------------------------------------------------------------------

export async function addToCart(userId, itemId, price, size, qty, totalPrice, addons = []) {
  try {
    // Prepare the addons array with their prices
    const addonNames = addons.map((addon) => addon.addon);
    const addonPrices = addons.map((addon) => addon.price);

    console.log(addonNames);
    console.log(addonPrices)
    // Create a new cart item document
    const cartItem = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.cartCollectionID,
      ID.unique(),
      {
        userId: userId,
        itemId: itemId,
        selectedSizePrice: price,          // Price of the item (without addons)
        selectedSize: size,            // Size of the item (e.g., 'regular', 'large', etc.)
        qty: qty,              // Quantity of the item
        totalPrice: totalPrice, // Total price (including addons)
        selectedAddons: addonNames,     // Array of addon names
        selectedAddonPrices: addonPrices // Array of addon prices
      }
    );

    return cartItem;
  } catch (error) {
    throw new Error(`Failed to add item to cart: ${error.message}`);
  }
}


export async function deleteCartItem(cartItemId) {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.cartCollectionID,
      cartItemId
    );
    console.log("Cart item deleted successfully.");
  } catch (error) {
    throw new Error(`Failed to delete cart item: ${error.message}`);
  }
}

export async function fetchCartItems(userId) {
  try {
    // Fetch the user's cart items from the cart collection
    const cartItems = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.cartCollectionID,
      [Query.equal('userId', userId)]  // Querying by userId
    );

    // console.log("Fetched Cart Items:", cartItems); // Log cartItems

    if (cartItems.documents.length === 0) {
      console.log("No cart items found for this user.");
    }

    // Now fetch the details of each food item in the cart
    const foodItemDetails = await Promise.all(
      cartItems.documents.map(async (cartItem) => {
        return await fetchFoodItemDetails(cartItem.itemId); // Fetch the full details of the food item
      })
    );

    // console.log("Fetched Food Item Details:", foodItemDetails); // Log foodItemDetails

    return [foodItemDetails, cartItems.documents];
  } catch (error) {
    throw new Error(error.message);
  }
}


// --------------------------------------------------------------------------------------
// Feedback Management Functions
// --------------------------------------------------------------------------------------

export async function sendFeedback(userId, feedback){
  try {
    const result = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.feedbackCollectionID,
      ID.unique(), {
      userId: userId,
      Feedback: feedback,
    });

    console.log("Feedback inserted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error inserting feedback:", error);
    throw error; // Propagate error for handling in UI
  }
};



















// --------------------------------------------------------------------------------------
// Video Post Management Functions
// --------------------------------------------------------------------------------------

// Create a new video post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get all video posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error.message);
  }
}

// --------------------------------------------------------------------------------------
