import { useNavigation } from "@react-navigation/native";
import { signOut } from "aws-amplify/auth";
import { Button, Text, View } from "react-native";

//Profile coaches see when they click on their icon
const CoachProfile = () => {
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await signOut();
    navigation.navigate("Setup");
  }

  return (
    <View>
      <Text>Coach Profile</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default CoachProfile;