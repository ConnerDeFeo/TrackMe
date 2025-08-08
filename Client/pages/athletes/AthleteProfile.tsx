import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import UserService from "../../services/UserService";
import TrackMeButton from "../../components/TrackMeButton";

//Profile athletes see when they click on their icon
const AthleteProfile = () => {
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await UserService.signOut();
    navigation.navigate("Setup");
  }

  return (
    <View>
      <Text>Athlete Profile</Text>
      <TrackMeButton title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default AthleteProfile;