import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";
import UserService from "../../services/UserService";

//Profile athletes see when they click on their icon
const AthleteProfile = () => {
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await UserService.signOut();
    navigation.navigate("SignIn");
  }

  return (
    <View className="mt-[4rem]">
      <Text className="text-4xl font-bold ml-4">Profile</Text>
      <Button title={'Logout'} onPress={handleLogout} color={'#E63946'}/>
    </View>
  );
};

export default AthleteProfile;