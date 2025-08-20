import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Image, Text,TouchableOpacity,View } from "react-native";
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
  const [workout, setWorkout] = useState<Array<any>>();

  //Grabs all athletes that are a part of the group
  const fetchParticipants = async () => {
      const resp = await CoachGroupService.getAthletesForGroup(groupId);
      if (resp.ok) {
        const data = await resp.json();
        setParticipants(data);
      }
      else{
        setParticipants([]);
      }
    }

  //Fetches the workout for the current date
  const fetchWorkout = async () => {
    const userId = await UserService.getUserId();
    const date = new Date().toISOString().split("T")[0];
    const resp = await CoachWorkoutService.getGroupWorkout(userId!, groupId, date);
    if(resp.ok){
      const workout = await resp.json();
      setWorkout(workout);
    }
  }

  useEffect(()=>{
    fetchParticipants();
    fetchWorkout();
  },[])

  const removeAthleteFromGroup = async (athleteId: string) => {
    const resp = await CoachGroupService.removeAthleteFromGroup(athleteId, groupId);
    
    if (resp.ok) {
      await fetchParticipants(); // Add await here
    }
  }

  return (
    <View className="flex-1 bg-gray-50 px-6 pt-16">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2">{groupName}</Text>
        <Text className="text-gray-600">Manage your group and workouts</Text>
      </View>

      <View className="space-y-4 mb-8">
      <TouchableOpacity 
        onPress={() => navigation.navigate('AssignWorkout',{groupId: groupId, groupName: groupName, fetchWorkout:fetchWorkout})}
        className="bg-[#E63946] rounded-lg py-3 px-4"
      >
        <Text className="text-white font-semibold text-center">{workout ? "Update Workout" : "Send Workout"}</Text>
      </TouchableOpacity>
      {workout && 
        <TouchableOpacity 
          onPress={() => navigation.navigate('ViewWorkoutCoach', { groupName:groupName })}
          className="bg-black rounded-lg py-3 px-4 mt-2"
        >
          <Text className="text-white font-semibold text-center">View Group Workout</Text>
        </TouchableOpacity>
      }
      </View>

      {workout && <DisplayWorkout workout={workout} onPress={() => navigation.navigate('CreateWorkout', { workout })} />}

      <View className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-900">
            Athletes ({participants.length})
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AssignAthletes', { groupId: groupId, fetchParticipants: fetchParticipants})}
            className="flex items-center"
          >
            <Text className="text-[#E63946] underline">Add Athletes</Text>
          </TouchableOpacity>
        </View>
        {participants.length > 0 ? (
          participants.map((participant) => (
            <View key={participant[0]} className="py-2 border-b border-gray-100 last:border-b-0 flex flex-row justify-between items-center">
              <Text className="text-gray-800 font-medium">{participant[1]}</Text>
              <TouchableOpacity onPress={() => removeAthleteFromGroup(participant[0])}>
                <Text className="text-[#E63946] underline text-md">Remove</Text>
              </TouchableOpacity>
            </View>
        ))
        ) : (
        <Text className="text-gray-500 italic">No athletes assigned yet</Text>
        )}
      </View>
    </View>
  );
};

export default ViewGroup;