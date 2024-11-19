import { SafeAreaView, Text, View, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { CustomButton } from '../../components';
import { sendFeedback } from "../../lib/appwrite";
import { useGlobalContext } from '../../context/GlobalProvider';

const Feedback = () => {
  const { user } = useGlobalContext();
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFeedbackSubmit = async () => {
    if(!user){
      return
    }
    
    if (feedback.trim() === '') {
      Alert.alert('Error', 'Please provide your feedback.');
      return;
    }

    setIsLoading(true);

    try {
      // API call to submit feedback
      // Actual feedback submission logic
      await sendFeedback(user?.$id, feedback);

      Alert.alert('Thank you!', 'Your feedback has been submitted.');
      setFeedback(''); // Clear the feedback input
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="px-4 pt-9 bg-primary flex-1">
      {/* Feedback Title */}
      <Text className="text-2xl font-semibold text-white px-2 my-2">Feedback</Text>

      {/* Feedback Input Section */}
      <View className="flex-1 justify-start items-center mt-4">
        <View className="w-full">
          <Text className="text-gray-200 mb-1 text-base">Tell us what you love about the app, or what we could be doing better.</Text>
          <View className="bg-tertiary rounded-lg border border-gray-100 p-3 my-2">
            <TextInput
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Write your feedback here..."
              placeholderTextColor="#CDCDE0"
              className="text-white text-base"
              editable={!isLoading}
              multiline={true}
              numberOfLines={5}
            />
          </View>
        </View>

        {/* Submit Button using CustomButton */}
        <CustomButton
          title="Submit Feedback"
          handlePress={handleFeedbackSubmit}
          containerStyles="mt-6 w-full"
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default Feedback;
