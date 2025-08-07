import { useRoute } from "@react-navigation/native";
import { Text,Button,View } from "react-native";

//Page for viewing a given group
const ViewGroup = () => {
  const route = useRoute();

  const {groupName} = route.params as { groupName: string };

  return (
    <View>
      <Text>{groupName}</Text>
      <Button title="Edit Group"/>
    </View>
  );
};

export default ViewGroup;