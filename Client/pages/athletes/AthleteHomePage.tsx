import { fetchUserAttributes} from "aws-amplify/auth";
import { use, useEffect } from "react";
import { Text, View } from "react-native";

const AthleteHomePage = () => {
  useEffect(() => {
    const fetchData = async () => {
      const userAttributes = await fetchUserAttributes();
      console.log("Current User:", userAttributes['custom:accountType']);
    };
    fetchData();
  }, []);
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-3xl text-center">Welcome to the Athlete Home Page!</Text>
            <Text className="text-lg">This is where you can manage your account and view your data.</Text>
        </View>
    );
}

export default AthleteHomePage;