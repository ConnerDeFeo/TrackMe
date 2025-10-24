import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import DisplayWorkout from "../../common/components/display/workout/DisplayWorkout";
import GeneralService from "../../services/GeneralService";
import UserDisplay from "../../common/components/display/UserDisplay";
import TextButton from "../../common/components/display/TextButton";

/**
 * Page: ViewGroupAthlete
 * Displays the workouts and athletes for a specific group.
 */
const ViewGroupAthlete = () => {
    // Navigation and route hooks
    const navigation = useNavigation<any>();
    const route = useRoute();

    // Extract groupName and groupId from route parameters
    const { groupName, groupId } =
        (route.params as { groupName: string; groupId: string }) || {};

    // State for storing fetched workouts and athletes
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [athletes, setAthletes] = useState<string[][]>([]);

    useEffect(() => {
        // Fetch workouts for the current group
        const fetchWorkout = async () => {
            const resp = await GeneralService.getGroupWorkout(groupId);
            if (resp.ok) {
                const data = await resp.json();
                setWorkouts(data);
            }
        };

        // Fetch athletes belonging to the current group
        const fetchAthletes = async () => {
            const resp = await GeneralService.getAthletesForGroup(groupId);
            if (resp.ok) {
                const data = await resp.json();
                setAthletes(data);
            }
        };

        // Trigger data fetch when component mounts or groupId changes
        fetchWorkout();
        fetchAthletes();
    }, [groupId]);

    return (
        <View className="px-4">
            {/* Button to navigate to the group's schedule */}
            <TextButton
                text="Schedule"
                onPress={() => navigation.navigate('GroupSchedule', { groupId, groupName })}
            />
            <View className="my-2">
                {/* Render each workout */}
                {workouts.map((workout) => (
                    <DisplayWorkout
                        key={workout.groupWorkoutId}
                        workout={workout}
                        onPress={() => {
                            /* TODO: handle workout selection */
                        }}
                    />
                ))}
            </View>

            <Text className="text-2xl font-bold mt-2 mb-4">
                Athletes
            </Text>

            {/* List all athletes in the group */}
            <View className="gap-y-2">
                {athletes.map((athlete) => {
                    // athlete array format: [id, username, firstName, lastName]
                    const [id, username, firstName, lastName] = athlete;
                    return (
                        <UserDisplay
                            key={id}
                            username={username}
                            firstName={firstName}
                            lastName={lastName}
                            className="mb-2 border trackme-border-gray rounded-lg p-2"
                        />
                    );
                })}
            </View>
        </View>
    );
};

export default ViewGroupAthlete;