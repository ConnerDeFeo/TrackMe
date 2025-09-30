import { useNavigation, useRoute } from "@react-navigation/native";
import { Pressable, Text,TouchableOpacity,View } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import CoachGroupService from "../../../services/CoachGroupService";
import DisplayWorkout from "../../../components/DisplayWorkout";
import GeneralService from "../../../services/GeneralService";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import DateService from "../../../services/DateService";

// Page component for viewing and managing a coach's group
const ViewGroup = () => {
  // Get navigation and route parameters from React Navigation
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { groupName, groupId } = route.params as { groupName: string; groupId: string };

  // Local state for participants, workouts, and deletion confirmation mode
  const [participants, setParticipants] = useState<string[]>([]);
  const [workouts, setWorkouts] = useState<Array<any>>([]);
  const [deletionMode, setDeletionMode] = useState<boolean>(false);

  /**
   * Fetches all athletes in the current group from the server
   * and updates the `participants` state.
   */
  const fetchParticipants = useCallback(async () => {
    const resp = await GeneralService.getAthletesForGroup(groupId);
    if (resp.ok) {
      const data = await resp.json();
      setParticipants(data);
    } else {
      // Clear participants if the request fails
      setParticipants([]);
    }
  }, [groupId]);

  /**
   * Fetches the group's workout for today from the server
   * and updates the `workouts` state.
   */
  const fetchWorkout = useCallback(async () => {
    const date = DateService.getCurrentDate();
    const resp = await GeneralService.getGroupWorkout(groupId, date);
    if (resp.ok) {
      const workouts = await resp.json();
      setWorkouts(workouts);
    } else {
      // Clear workouts if the request fails
      setWorkouts([]);
    }
  }, [groupId]);

  // Re-fetch participants and workouts each time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchParticipants();
      fetchWorkout();
    }, [fetchParticipants, fetchWorkout])
  );

  /**
   * Removes a single athlete from the group on the server,
   * then refreshes the participants list.
   */
  const removeAthleteFromGroup = async (athleteId: string) => {
    const resp = await CoachGroupService.removeAthleteFromGroup(athleteId, groupId);
    if (resp.ok) {
      await fetchParticipants();
    }
  };

  /**
   * Deletes the entire group on the server,
   * then resets navigation to the CoachGroups list.
   */
  const handleGroupDeletion = async () => {
    const resp = await CoachGroupService.deleteGroup(groupId);
    if (resp.ok) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'CoachGroups' }],
      });
    }
  };

  /**
   * Deletes a specific group workout on the server,
   * then refreshes the workouts list.
   */
  const handleWorkoutRemoval = async (groupWorkoutId: string) => {
    const resp = await CoachWorkoutService.deleteGroupWorkout(groupWorkoutId);
    if (resp.ok) {
      await fetchWorkout();
    }
  };

  console.log(workouts)
  return (
    <View className="pb-12 px-4 mt-4">
      {/* Action buttons: Send workout and view group inputs */}
      <View className="gap-y-4 mb-8">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AssignWorkout', { groupId, groupName })
          }
          className="bg-[#E63946] rounded-lg py-3"
        >
          <Text className="text-white font-semibold text-center">
            Send Workout
          </Text>
        </TouchableOpacity>

        {workouts.length > 0 && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ViewGroupInputsCoach', {
                groupId,
                groupName,
              })
            }
            className="bg-black rounded-lg py-3 mt-2"
          >
            <Text className="text-white font-semibold text-center">
              Group Inputs
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Display assigned workouts with remove option */}
      {workouts.map((workout) => (
        <DisplayWorkout
          key={workout.groupWorkoutId}
          workout={workout}
          onPress={() =>
            navigation.navigate('AssignNewWorkout', {
              groupId,
              groupName,
              workout,
            })
          }
          onRemove={() => handleWorkoutRemoval(workout.groupWorkoutId)}
        />
      ))}

      {/* Athletes list panel */}
      <View className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-900">
            Athletes ({participants.length})
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AssignAthletes', { groupId })
            }
            className="flex items-center"
          >
            <Text className="trackme-blue">Add Athletes</Text>
          </TouchableOpacity>
        </View>

        {/* Show participants or placeholder text */}
        {participants.length > 0 ? (
          participants.map((participant) => (
            <View
              key={participant[0]}
              className="py-2 border-b border-gray-100 last:border-b-0 flex flex-row justify-between items-center"
            >
              <Text className="text-gray-800 font-medium">
                {participant[1]}
              </Text>
              <TouchableOpacity
                onPress={() => removeAthleteFromGroup(participant[0])}
              >
                <Text className="trackme-red text-md">Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text className="text-gray-500 italic">
            No athletes assigned yet
          </Text>
        )}
      </View>

      {/* Group deletion confirmation controls */}
      {deletionMode ? (
        <View className="flex flex-row justify-between items-center mt-4">
          <Pressable onPress={handleGroupDeletion}>
            <Text className="trackme-blue text-md">Confirm</Text>
          </Pressable>
          <TouchableOpacity onPress={() => setDeletionMode(false)}>
            <Text className="text-md">Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setDeletionMode(true)}
          className="bg-black rounded-lg py-3 px-4 mt-2"
        >
          <Text className="text-white font-semibold text-center">
            Delete Group
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ViewGroup;