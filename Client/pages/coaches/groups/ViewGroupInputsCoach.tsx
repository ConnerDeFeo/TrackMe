import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import GeneralService from "../../../services/GeneralService";

const ViewGroupInputsCoach = ()=>{
    const route = useRoute();
    const { groupId } = route.params as { groupId: string };
    const [workoutInputs, setWorkoutInputs] = useState<Record<string, {username:string, inputs:{distance:number, time:number}[]}>>({});

    //fetch athletes and workout inputs
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const workoutInputsResp = await GeneralService.viewGroupInputs(groupId);
                if(workoutInputsResp.ok) {
                    const workoutInputData = await workoutInputsResp.json();
                    setWorkoutInputs(workoutInputData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    },[])

    return(
        <View className="px-4 mt-4">
            {Object.entries(workoutInputs).map(([username, data])=>(
            <View key={username} className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4" style={{borderLeftColor: '#E63946'}}>
                <Text className="text-xl font-semibold text-black mb-4">{data.username}</Text>
                {data.inputs?.map((input, index) => (
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