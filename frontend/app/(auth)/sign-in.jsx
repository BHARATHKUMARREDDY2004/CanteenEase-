import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Image } from "react-native";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import CustomAlert from "../../components/CustomAlert"; // Import the custom alert

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [alertVisible, setAlertVisible] = useState(false); // State to control the alert visibility
  const [alertMessage, setAlertMessage] = useState(""); // State to store alert message
  const [alertTitle, setAlertTitle] = useState(""); // State to store alert title

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      setAlertTitle("Error");
      setAlertMessage("Please fill in all fields");
      setAlertVisible(true);
      return;
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      setAlertTitle("Success");
      setAlertMessage("User signed in successfully");
      setAlertVisible(true);
      router.replace("/home");
    } catch (error) {
      setAlertTitle("Invalid Credentials");
      setAlertMessage("Please check your email and password.");
      setAlertVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Log in to CanteenEase
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            required
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            required
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>

        {/* Custom Alert Modal */}
        <CustomAlert
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
          title={alertTitle}
          message={alertMessage}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;




// import { useState } from "react";
// import { Link, router } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

// import { images } from "../../constants";
// import { CustomButton, FormField } from "../../components";
// import { getCurrentUser, signIn } from "../../lib/appwrite";
// import { useGlobalContext } from "../../context/GlobalProvider";

// const SignIn = () => {
//   const { setUser, setIsLogged } = useGlobalContext();
//   const [isSubmitting, setSubmitting] = useState(false);
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const submit = async () => {
//     if (form.email === "" || form.password === "") {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       await signIn(form.email, form.password);
//       const result = await getCurrentUser();
//       setUser(result);
//       setIsLogged(true);

//       Alert.alert("Success", "User signed in successfully");
//       router.replace("/home");
//     } catch (error) {
//       Alert.alert("Error", error.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <SafeAreaView className="bg-primary h-full">
//       <ScrollView>
//         <View
//           className="w-full flex justify-center h-full px-4 my-6"
//           style={{
//             minHeight: Dimensions.get("window").height - 100,
//           }}
//         >
//           <Image
//             source={images.logo}
//             resizeMode="contain"
//             className="w-[115px] h-[34px]"
//           />

//           <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
//             Log in to CanteenEase
//           </Text>

//           <FormField
//             title="Email"
//             value={form.email}
//             handleChangeText={(e) => setForm({ ...form, email: e })}
//             otherStyles="mt-7"
//             keyboardType="email-address"
//             required
//           />

//           <FormField
//             title="Password"
//             value={form.password}
//             handleChangeText={(e) => setForm({ ...form, password: e })}
//             otherStyles="mt-7"
//             required
//           />

//           <CustomButton
//             title="Sign In"
//             handlePress={submit}
//             containerStyles="mt-7"
//             isLoading={isSubmitting}
//           />

//           <View className="flex justify-center pt-5 flex-row gap-2">
//             <Text className="text-lg text-gray-100 font-pregular">
//               Don't have an account?
//             </Text>
//             <Link
//               href="/sign-up"
//               className="text-lg font-psemibold text-secondary"
//             >
//               Signup
//             </Link>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default SignIn;
