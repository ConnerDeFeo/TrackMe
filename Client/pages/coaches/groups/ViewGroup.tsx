import { useNavigation, useRoute } from "@react-navigation/native";
import { Text,View } from "react-native";
import TrackMeButton from "../../../components/TrackMeButton";

//Page for viewing a given group
const ViewGroup = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const {groupName, groupId} = route.params as { groupName: string, groupId: string };

  return (
    <View>
      <Text className="text-2xl font-bold">{groupName}</Text>
      <TrackMeButton title="Add Athletes" onPress={() => navigation.navigate('AssignAthletes', { groupId: groupId })} />
      <TrackMeButton title="Send Workout" onPress={() => console.log("Send Workout")} />
    </View>
  );
};

export default ViewGroup;