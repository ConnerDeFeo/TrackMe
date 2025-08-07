import { useNavigation, useRoute } from "@react-navigation/native";
import { Text,Button,View } from "react-native";

//Page for viewing a given group
const ViewGroup = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {groupUsername} = route.params as { groupUsername: string };

  return (
    <View>
      <Text>Group Details</Text>
      <Button title="Edit Group"/>
    </View>
  );
};

export default ViewGroup;