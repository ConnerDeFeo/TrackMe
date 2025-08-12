import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import UserService from "../../services/UserService";
import TrackMeButton from "../../components/TrackMeButton";
import AsyncStorage from "../../services/AsyncStorage";

//Profile coaches see when they click on their icon
const CoachProfile = () => {
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await UserService.signOut();
    AsyncStorage.clear();
    navigation.navigate("Setup");
  }
  
  return (
    <View>
      <Text>Coach Profile</Text>
      <TrackMeButton title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default CoachProfile;