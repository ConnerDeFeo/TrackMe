import { useRoute } from "@react-navigation/native";
import { Pressable, Text,TouchableOpacity,View } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import CoachGroupService from "../../../services/CoachGroupService";
import DisplayWorkout from "../../../components/DisplayWorkout";
import GeneralService from "../../../services/GeneralService";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import { useNav } from "../../../hooks/useNav";

//Page for viewing a given group
const ViewGroup = () => {
  const route = useRoute();
  const { replace, navigate } = useNav();
  const {groupName, groupId} = route.params as { groupName: string, groupId: string };

  const [participants, setParticipants] = useState<string[]>([]);
  const [workouts, setWorkouts] = useState<Array<any>>([]);
  const [deletionMode, setDeletionMode] = useState<boolean>(false);

  //Grabs all athletes that are a part of the group
  const fetchParticipants = useCallback( async () => {
      const resp = await GeneralService.getAthletesForGroup(groupId);
      if (resp.ok) {
        const data = await resp.json();
        setParticipants(data);
      }
      else{
        setParticipants([]);
      }
    }
  , [groupId]);

  //Fetches the workout for the current date
  const fetchWorkout = useCallback(async () => {
    const date = new Date().toISOString().split("T")[0];
    const resp = await GeneralService.getGroupWorkout(groupId, date);
    if(resp.ok){
      const workouts = await resp.json();
      setWorkouts(workouts);
    }
    else{
      setWorkouts([]);
    }
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      fetchParticipants();
      fetchWorkout();
    }, [fetchParticipants, fetchWorkout])
  );

  const removeAthleteFromGroup = async (athleteId: string) => {
    const resp = await CoachGroupService.removeAthleteFromGroup(athleteId, groupId);
    if (resp.ok) {
      await fetchParticipants(); // Add await here
    }
  }

  const handleGroupDeletion = async () => {
    const resp = await CoachGroupService.deleteGroup(groupId);
    if (resp.ok) {
      replace('CoachGroups');
    }
  }

  const handleWorkoutRemoval = async (groupWorkoutId: string) => {
    const resp = await CoachWorkoutService.deleteGroupWorkout(groupWorkoutId);
    if (resp.ok) {
      await fetchWorkout();
    }
  }

  return (
    <View className="pb-12 px-4 mt-4">
      <View className="space-y-4 mb-8">
        <TouchableOpacity
          onPress={() => navigate('AssignWorkout', { groupId: groupId, groupName: groupName })}
          className="bg-[#E63946] rounded-lg py-3"
        >
          <Text className="text-white font-semibold text-center">Send Workout</Text>
        </TouchableOpacity>
        {workouts.length > 0 && 
          <TouchableOpacity 
            onPress={() => navigate('ViewGroupInputsCoach', { groupId, groupName })}
            className="bg-black rounded-lg py-3 mt-2"
          >
            <Text className="text-white font-semibold text-center">Group Inputs</Text>
          </TouchableOpacity>
        }
      </View>

      {workouts.map((workout) => (
        <DisplayWorkout 
          key={workout.groupWorkoutId} 
          workout={workout} 
          onPress={() => navigate('AssignNewWorkout', {groupId: groupId, groupName: groupName, workout: workout })} 
          onRemove={() => handleWorkoutRemoval(workout.groupWorkoutId)}
        />
      ))}

      <View className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-900">
            Athletes ({participants.length})
          </Text>
          <TouchableOpacity 
            onPress={() => navigate('AssignAthletes', { groupId: groupId, fetchParticipants: fetchParticipants})}
            className="flex items-center"
          >
            <Text className="text-[#E63946]">Add Athletes</Text>
          </TouchableOpacity>
        </View>
        {participants.length > 0 ? (
          participants.map((participant) => (
            <View key={participant[0]} className="py-2 border-b border-gray-100 last:border-b-0 flex flex-row justify-between items-center">
              <Text className="text-gray-800 font-medium">{participant[1]}</Text>
              <TouchableOpacity onPress={() => removeAthleteFromGroup(participant[0])}>
                <Text className="text-[#E63946] text-md">Remove</Text>
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
            <Text className="text-[#E63946] text-md">Confirm</Text>
          </Pressable>
          <TouchableOpacity onPress={() => setDeletionMode(false)}>
            <Text className="text-md">Cancel</Text>
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