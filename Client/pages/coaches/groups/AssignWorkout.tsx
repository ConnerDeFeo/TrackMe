import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import { useRoute } from "@react-navigation/native";
import DisplayWorkout from "../../../components/DisplayWorkout";
import PageHeading from "../../../components/PageHeading";
import { useNav } from "../../../hooks/useNav";

//Page where coaches can assign workouts to athletes
const AssignWorkout = ()=>{
    const route = useRoute();
    const { navigate, goBack } = useNav();
    const { groupId, groupName, fetchWorkout } = route.params as { groupId: string, groupName: string, fetchWorkout: ()=>void};
    const [workouts, setWorkouts] = useState<Array<any>>([]);

    //Fetch all workouts
    useEffect(() => {
        const fetchWorkouts = async () => {
            const coachId = await UserService.getUserId();
            const response = await CoachWorkoutService.getWorkoutTemplates(coachId!);
            if(response.ok) {
                const workouts = await response.json();
                setWorkouts(workouts || []);
            }
        };
        fetchWorkouts();
    }, []);

    const handleAssignTemplateWorkout = async (workoutId:string) => {
        const response = await CoachWorkoutService.assignWorkoutTemplateToGroup(workoutId, groupId);
        if (response.ok) {
            fetchWorkout();
            goBack();
        }
    };

    return (
        <>
            <PageHeading title={"Assign Workout"} goBack/>
            <TouchableOpacity
                onPress={() => navigate('AssignNewWorkout', { groupId: groupId, groupName: groupName })}
                className="bg-[#E63946] rounded-lg py-3 mx-4"
            >
                <Text className="text-white font-semibold text-center">Assign New Workout</Text>
            </TouchableOpacity>
            {workouts.map((workout, idx) => (
                <View key={idx} className="my-2">
                    <DisplayWorkout workout={workout} onPress={() => handleAssignTemplateWorkout(workout.workoutId)} />
                </View>
            ))}
        </>
    );
}

export default AssignWorkout;