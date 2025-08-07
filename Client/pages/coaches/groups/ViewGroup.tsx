import { useNavigation, useRoute } from "@react-navigation/native";
import { Text,Button,View } from "react-native";

//Page for viewing a given group
const ViewGroup = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const {groupName, groupId} = route.params as { groupName: string, groupId: string };

  return (
    <View>
      <Text className="text-2xl font-bold">{groupName}</Text>
      <Button title="Add Athletes" onPress={() => navigation.navigate('AssignAthletes', { groupId: groupId })} />
      <Button title="Send Workout" onPress={() => console.log("Send Workout")} />
    </View>
  );
};

export default ViewGroup;