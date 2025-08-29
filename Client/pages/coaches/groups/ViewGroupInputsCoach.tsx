import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import GeneralService from "../../../services/GeneralService";

const ViewGroupInputsCoach = ()=>{
    const route = useRoute();
    const { groupId } = route.params as { groupId: string };
    const [workoutInputs, setWorkoutInputs] = useState<Record<string, {distance: number, time: number}[]>>({});
    const [athletes, setAthletes] = useState<string[][]>([]);

    //fetch athletes and workout inputs
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const workoutInputsResp = await GeneralService.viewGroupInputs(groupId);
                const athletesResp = await GeneralService.getAthletesForGroup(groupId);
                if(athletesResp.ok){
                    const athletesData = await athletesResp.json();
                    console.log(athletesData);
                    setAthletes(athletesData);
                }
                if(workoutInputsResp.ok) {
                    const workoutInputData = await workoutInputsResp.json();
                    console.log(workoutInputData);
                    setWorkoutInputs(workoutInputData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    },[])

    return(
        <View className="my-16 px-6">
            <Text className="text-3xl font-bold text-black mb-8">Workout Inputs</Text>
            {athletes.map((athlete)=>(
            <View key={athlete[0]} className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4" style={{borderLeftColor: '#E63946'}}>
                <Text className="text-xl font-semibold text-black mb-4">{athlete[1]}</Text>
                {workoutInputs[athlete[0]]?.map((input, index) => (
                <View key={index} className="bg-gray-50 rounded-md p-4 mb-3 flex flex-row justify-between items-center">
                    <Text className="text-gray-800 font-medium text-md">Distance: {input.distance}m</Text>
                    <Text className="text-gray-800 font-medium text-md">Time: {input.time}s</Text>
                </View>
                ))}
            </View>
            ))}
        </View>
    );
}

export default ViewGroupInputsCoach;