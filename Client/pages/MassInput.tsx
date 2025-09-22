import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import GeneralService from "../services/GeneralService";
import usePersistentState from "../hooks/usePersistentState";
import InputTracking from "../components/InputTracking";

const MassInput = () => {
  const route = useRoute();
  const { groupId, groupName } = route.params as { groupId: string; groupName: string };
  const [workoutInputs, setWorkoutInputs] = useState<Record<string, {distance: number, time: number}[]>>({});
  const [athletes, setAthletes] = useState<string[][]>([]);
  // Track current input values for each given group { groupId : [time/distance, time/distance] }
  const [currentInputs, setCurrentInputs] = 
  usePersistentState<Record<string, { time?: string | undefined; distance?: string | undefined}[]>>('currentMassInputs', {});

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

  // Handle time input changes with validation (numbers only)
    const handleTimeChange = (athleteId:string, idx: number, value: string)=>{
        let updatedValue = ''
        // Only allow numeric values or empty string
        if(!isNaN(Number(value)) || value === ''){
          updatedValue = value
        }
        // Update the specific input in the group while preserving other inputs
        setCurrentInputs(prev => {
            const updatedAthlete = prev[athleteId]?.map((input, i) => i === idx ? { ...input, time: updatedValue } : input) || [];
            return { ...prev, [athleteId]: updatedAthlete };
        });
    }

    // Handle distance input changes with validation (numbers only)
    const handleDistanceChange = (athleteId:string, idx: number, value: string)=>{
        let updatedValue = ''
        // Only allow numeric values or empty string
        if(!isNaN(Number(value)) || value === ''){
            updatedValue = value
        }
        // Update the specific input in the group while preserving other inputs
        setCurrentInputs(prev => {
            const updatedAthlete = prev[athleteId]?.map((input, i) => i === idx ? { ...input, distance: updatedValue } : input) || [];
            return { ...prev, [athleteId]: updatedAthlete };
        });
    }

  return (
    <View className="px-4 mt-4">
      {athletes.map((athlete)=>(
        <View key={athlete[0]} className="bg-white rounded-lg p-2 mb-2 border-b" >
            <Text className="text-xl font-semibold text-black mb-4">{athlete[1]}</Text>
            {workoutInputs[athlete[0]]?.map((input, index) => (
              <View key={index} className="flex flex-row justify-between items-center">
                  <Text className="text-gray-800 font-medium text-md">Distance: {input.distance}m</Text>
                  <Text className="text-gray-800 font-medium text-md">Time: {input.time}s</Text>
              </View>
            ))}

            <InputTracking
                currentInputs={currentInputs}
                setCurrentInputs={setCurrentInputs}
                identifierId={athlete[0]}
                handleTimeChange={handleTimeChange}
                handleDistanceChange={handleDistanceChange}
            />
        </View>
      ))}
  </View>
  );
}

export default MassInput;