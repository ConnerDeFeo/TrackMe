import { useNavigation, useRoute } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import DisplayWorkout from "../../../common/components/display/DisplayWorkout";
import GeneralService from "../../../services/GeneralService";
import DateService from "../../../services/DateService";
import ArrowButton from "../../../common/components/ArrowButton";
import UserDisplay from "../../../common/components/display/UserDisplay";
import TextButton from "../../../common/components/display/TextButton";

// Page component for viewing and managing a coach's group
const ViewGroup = () => {
  // Get navigation and route parameters from React Navigation
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { groupName, groupId } = route.params as { groupName: string; groupId: string };

  // Local state for participants, workouts, and deletion confirmation mode
  const [participants, setParticipants] = useState<string[]>([]);
  const [workouts, setWorkouts] = useState<Array<any>>([]);

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
    const date = DateService.formatDate(new Date());
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

  return (
    <View className="px-4 mb-8">
      {/* Action buttons: Send workout and view group inputs */}
      <View className="flex flex-row items-center justify-between mt-2 mb-2">
        <TextButton text="Schedule" onPress={() => navigation.navigate('GroupSchedule', { groupId, groupName })} />
        <TextButton text="Group Inputs" onPress={() => navigation.navigate('ViewGroupInputsCoach', {groupId, groupName})}/>
      </View>

      <View className="my-2">
        {/* Display assigned workouts with remove option */}
        {workouts.map((workout) => (
          <DisplayWorkout
            key={workout.groupWorkoutId}
            workout={workout}
            onPress={() =>
              navigation.navigate('AssignNewWorkout', {
                groupId,
                groupName,
                workout
              })  
            }
          />
        ))}
      </View>

      {/* Athletes list panel */}
      <Pressable className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        onPress={() =>
          navigation.navigate('AssignAthletes', { groupId })
        }
      >
        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-900">
            Athletes ({participants.length})
          </Text>
          <ArrowButton onPress={() => navigation.navigate('AssignAthletes', { groupId })} />
        </View>

        {/* Show participants or placeholder text */}
        {participants.length > 0 ? (
          participants.map((participant) => (
            <UserDisplay key={participant[0]} username={participant[1]} firstName={participant[2]} lastName={participant[3]} className="mb-4 ml-2" />
          ))
        ) : (
          <Text className="text-gray-500 italic">
            No athletes assigned yet
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default ViewGroup;