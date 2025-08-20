import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";
import UserService from "../../services/UserService";
import AsyncStorage from "../../services/AsyncStorage";

//Profile coaches see when they click on their icon
const CoachProfile = () => {
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await UserService.signOut();
    AsyncStorage.clear();
    navigation.navigate("SignIn");
  }
  
  return (
    <View className="mt-[4rem]">
      <Text className="text-4xl font-bold text-gray-800 mb-4">Profile</Text>
      <Button title="Logout" onPress={handleLogout} color={'#E63946'}/>
    </View>
  );
};

export default CoachProfile;