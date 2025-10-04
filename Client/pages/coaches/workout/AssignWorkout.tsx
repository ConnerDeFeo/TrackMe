import { useEffect, useState } from "react";
import { Text, Pressable, View } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import { useNavigation, useRoute } from "@react-navigation/native";
import DisplayWorkout from "../../../components/display/DisplayWorkout";

// AssignWorkout component for assigning workouts to a group
const AssignWorkout = () => {
    // Retrieve route params and navigation object
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { groupId, groupName, date } = route.params as { groupId: string; groupName: string, date: string };

    // State for storing fetched workout templates
    const [workouts, setWorkouts] = useState<Array<any>>([]);

    // Fetch all workout templates when component mounts
    useEffect(() => {
        const fetchWorkouts = async () => {
            const response = await CoachWorkoutService.getWorkoutTemplates();
            if (response.ok) {
                const workouts = await response.json();
                setWorkouts(workouts || []);
            }
        };
        fetchWorkouts();
    }, []);

    // Assign the selected template workout to the group and navigate back on success
    const handleAssignTemplateWorkout = async (workoutId: string) => {
        const response = await CoachWorkoutService.assignWorkoutTemplateToGroup(workoutId, groupId, date);
        if (response.ok) {
            navigation.goBack();
        }
    };

    return (
        <View className="mt-2 gap-y-4">
            <Text className="text-xl font-semibold my-4 px-4">{groupName}, {date}</Text>
            {/* List of fetched workout templates */}
            <View className="flex gap-y-2">
                {workouts.map((workout, idx) => (
                    <DisplayWorkout
                        key={idx}
                        workout={workout}
                        onPress={() => handleAssignTemplateWorkout(workout.workoutId)}
                    />
                ))}
            </View>
            {/* Button to navigate to the screen for creating a new workout */}
            <Pressable
                onPress={() => navigation.navigate('AssignNewWorkout', { groupId, groupName, date})}
                className="trackme-bg-blue rounded-lg py-3 mx-4 mt-4"
            >
                <Text className="text-white font-semibold text-center">Assign New Workout</Text>
            </Pressable>
        </View>
    );
};

export default AssignWorkout;