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
    <View>
      <Text>Athlete Profile</Text>
      <Button title={'Logout'} onPress={handleLogout}/>
    </View>
  );
};

export default AthleteProfile;