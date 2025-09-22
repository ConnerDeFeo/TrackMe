import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import GeneralService from "../../../services/GeneralService";
import TimeDistanceDisplay from "../../../components/TimeDistanceDisplay";

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
                    setAthletes(athletesData);
                }
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
            {athletes.map((athlete)=>(
            <View key={athlete[0]} className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4" style={{borderLeftColor: '#E63946'}}>
                <Text className="text-xl font-semibold text-black mb-4">{athlete[1]}</Text>
                {workoutInputs[athlete[0]]?.map((input, index) => (
                    <TimeDistanceDisplay key={index} time={input.time} distance={input.distance} />
                ))}
            </View>
            ))}
        </View>
    );
}

export default ViewGroupInputsCoach;