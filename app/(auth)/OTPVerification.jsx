import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { verifyOTP } from "../../lib/appwrite";
import { useRouter } from "expo-router";

const OTPVerification = ({ route }) => {
  const { userId } = route.params;
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await verifyOTP(userId, otp);
      Alert.alert("Success", "Email verified successfully!");
      router.replace("/home"); // Redirect to home after successful verification
    } catch (error) {
      Alert.alert("Error", "Invalid OTP or verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter the OTP sent to your email:</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        placeholder="OTP"
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginVertical: 20 }}
      />
      <Button title="Verify OTP" onPress={handleVerify} disabled={isVerifying} />
    </View>
  );
};

export default OTPVerification;
