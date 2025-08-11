import { useNavigation, useRoute } from "@react-navigation/native";
import { Text,View } from "react-native";
import TrackMeButton from "../../../components/TrackMeButton";
import { useEffect, useState } from "react";
import CoachGroupService from "../../../services/CoachGroupService";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import DisplayWorkout from "../../../components/DisplayWorkout";

//Page for viewing a given group
const ViewGroup = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const {groupName, groupId} = route.params as { groupName: string, groupId: string };

  const [participants, setParticipants] = useState<string[]>([]);
  const [workout, setWorkout] = useState<Array<any>>([]);

  //Grabs all athletes that are a part of the group
  const fetchParticipants = async () => {
      const resp = await CoachGroupService.getAthletesForGroup(groupId);
      if (resp.ok) {
        const data = await resp.json();
        setParticipants(data);
      }
    }

  const fetchWorkout = async () => {
    const userId = await UserService.getUserId();
    const date = new Date().toISOString().split("T")[0];
    const resp = await CoachWorkoutService.getGroupWorkout(userId!, groupId, date);
    if(resp.ok){
      const data = await resp.json();
      const workout = data['Items'] || []
      setWorkout(workout);
    }
  }

  useEffect(()=>{
    fetchParticipants();
    fetchWorkout();
  },[])

  return (
    <View>
      <Text className="text-2xl font-bold">{groupName}</Text>
      <TrackMeButton title="Add Athletes" onPress={() => navigation.navigate('AssignAthletes', { groupId: groupId, fetchParticipants: fetchParticipants})} />
      <TrackMeButton title="Send Workout" onPress={() => navigation.navigate('AssignWorkout',{groupId: groupId, groupName: groupName})} />
      {workout && <DisplayWorkout workout={workout} />}
      {participants.map((participant) => (
        <Text key={participant[0]}>{participant[1]}</Text>
      ))}
    </View>
  );
};

export default ViewGroup;