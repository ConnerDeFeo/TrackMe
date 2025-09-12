import { useNavigation, useRoute } from "@react-navigation/native";
import { Pressable, Text,TouchableOpacity,View } from "react-native";
import { useEffect, useState } from "react";
import CoachGroupService from "../../../services/CoachGroupService";
import UserService from "../../../services/UserService";
import DisplayWorkout from "../../../components/DisplayWorkout";
import GeneralService from "../../../services/GeneralService";
import CoachWorkoutService from "../../../services/CoachWorkoutService";

//Page for viewing a given group
const ViewGroup = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const {groupName, groupId} = route.params as { groupName: string, groupId: string };

  const [participants, setParticipants] = useState<string[]>([]);
  const [workouts, setWorkouts] = useState<Array<any>>([]);
  const [deletionMode, setDeletionMode] = useState<boolean>(false);

  //Grabs all athletes that are a part of the group
  const fetchParticipants = async () => {
      const resp = await GeneralService.getAthletesForGroup(groupId);
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
    const date = new Date().toISOString().split("T")[0];
    const resp = await GeneralService.getGroupWorkout(groupId, date);
    if(resp.ok){
      const workouts = await resp.json();
      setWorkouts(workouts);
    }
    else{
      setWorkouts([]);
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

  const handleGroupDeletion = async () => {
    const resp = await CoachGroupService.deleteGroup(groupId);
    if (resp.ok) {
      navigation.goBack();
    }
  }

  const handleWorkoutRemoval = async (groupWorkoutId: string) => {
    const resp = await CoachWorkoutService.deleteGroupWorkout(groupWorkoutId);
    if (resp.ok) {
      await fetchWorkout();
    }
  }

  return (
    <View className="flex-1 px-6 pt-16 pb-12">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2">{groupName}</Text>
        <Text className="text-gray-600">Manage your group and workouts</Text>
      </View>

      <View className="space-y-4 mb-8">
        <TouchableOpacity 
          onPress={() => navigation.navigate('AssignWorkout',{groupId: groupId, groupName: groupName, fetchWorkout:fetchWorkout})}
          className="bg-[#E63946] rounded-lg py-3 px-4"
        >
          <Text className="text-white font-semibold text-center">{workouts.length > 0 ? "Update Workout" : "Send Workout"}</Text>
        </TouchableOpacity>
        {workouts.length > 0 && 
          <TouchableOpacity 
            onPress={() => navigation.navigate('ViewGroupInputsCoach', { groupId:groupId })}
            className="bg-black rounded-lg py-3 px-4 mt-2"
          >
            <Text className="text-white font-semibold text-center">View Group Inputs</Text>
          </TouchableOpacity>
        }
      </View>

      {workouts.map((workout) => (
        <DisplayWorkout 
          key={workout.groupWorkoutId} 
          workout={workout} 
          onPress={() => navigation.navigate('CreateWorkout', { workout })} 
          onRemove={() => handleWorkoutRemoval(workout.groupWorkoutId)}
        />
      ))}

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
      { deletionMode ?
        <View className="flex flex-row justify-between items-center mt-4">
          <Pressable onPress={handleGroupDeletion}>
            <Text className="text-[#E63946] underline text-md">Confirm</Text>
          </Pressable>
          <TouchableOpacity onPress={() => setDeletionMode(false)}>
            <Text className="underline text-md">Cancel</Text>
          </TouchableOpacity>
        </View>
        :
        <TouchableOpacity 
          onPress={()=> setDeletionMode(true)}
          className="bg-black rounded-lg py-3 px-4 mt-2"
        >
          <Text className="text-white font-semibold text-center">Delete Group</Text>
        </TouchableOpacity>
      }
    </View>
  );
};

export default ViewGroup;