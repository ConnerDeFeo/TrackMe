import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import { useRoute } from "@react-navigation/native";
import DisplayWorkout from "../../../components/DisplayWorkout";
import { useNav } from "../../../hooks/useNav";

//Page where coaches can assign workouts to athletes
const AssignWorkout = ()=>{
    const route = useRoute();
    const { navigate, goBack } = useNav();
    const { groupId, groupName } = route.params as { groupId: string, groupName: string };
    const [workouts, setWorkouts] = useState<Array<any>>([]);

    //Fetch all workouts
    useEffect(() => {
        const fetchWorkouts = async () => {
            const response = await CoachWorkoutService.getWorkoutTemplates();
            if(response.ok) {
                const workouts = await response.json();
                setWorkouts(workouts || []);
            }
        };
        fetchWorkouts();
    }, []);

    const handleAssignTemplateWorkout = async (workoutId:string) => {
        const response = await CoachWorkoutService.assignWorkoutTemplateToGroup(workoutId, groupId);
        console.log(response);
        if (response.ok) {
            goBack();
        }
    };

    return (
        <View className="mt-4">
            <TouchableOpacity
                onPress={() => navigate('AssignNewWorkout', { groupId: groupId, groupName: groupName })}
                className="bg-[#E63946] rounded-lg py-3 mx-4"
            >
                <Text className="text-white font-semibold text-center">Assign New Workout</Text>
            </TouchableOpacity>
            <View className="flex gap-y-2">
                {workouts.map((workout, idx) => (
                    <DisplayWorkout key={idx} workout={workout} onPress={() => handleAssignTemplateWorkout(workout.workoutId)} />
                ))}
            </View>
        </View>
    );
}

export default AssignWorkout;