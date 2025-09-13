import { useEffect, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import { useNavigation, useRoute } from "@react-navigation/native";
import DisplayWorkout from "../../../components/DisplayWorkout";

//Page where coaches can assign workouts to athletes
const AssignWorkout = ()=>{
    const route = useRoute();
    const navigation = useNavigation<any>();
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
            navigation.goBack();
        }
    };

    return (
        <View className="mt-[4rem]">
            <Text className="text-4xl font-bold pl-4">Assign Workout</Text>
            <Button title="Assign New Workout" onPress={() => navigation.navigate('AssignNewWorkout', { groupId: groupId, groupName: groupName })} />
            {workouts.map((workout, idx) => (
                <View key={idx} className="my-2">
                    <DisplayWorkout workout={workout} onPress={() => handleAssignTemplateWorkout(workout.workoutId)} />
                </View>
            ))}
        </View>
    );
}

export default AssignWorkout;