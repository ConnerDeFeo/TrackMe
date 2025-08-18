import { Button, View } from "react-native";
import Groups from "../../../components/groups/Groups";
import { useNavigation } from "@react-navigation/native";

//Page where coaches can see and manage their groups
const CoachGroups = () => {
  const navigation = useNavigation<any>();

  return (
    <View>
      <Groups />
      <Button
        title="Create Group"
        onPress={() => navigation.navigate('CreateGroup')}
      />
    </View>
  );
}

export default CoachGroups;