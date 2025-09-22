import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import GeneralService from "../services/GeneralService";
import usePersistentState from "../hooks/usePersistentState";
import InputTracking from "../components/InputTracking";
import TimeDistanceDisplay from "../components/TimeDistanceDisplay";

const MassInput = () => {
  const route = useRoute();
  const { groupId, groupName } = route.params as { groupId: string; groupName: string };
  const [workoutInputs, setWorkoutInputs] = useState<Record<string, {distance: number, time: number}[]>>({});
  const [athletes, setAthletes] = useState<string[][]>([]);
  // Track current input values for each given group { groupId : [time/distance, time/distance] }
  const [currentInputs, setCurrentInputs] = 
  usePersistentState<Record<string, { time: string | undefined; distance: string | undefined}[]>>('currentMassInputs', {});

  //fetch athletes and workout inputs
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
  useEffect(()=>{
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

    // Handle distance input changes with validation (integers only)
    const handleDistanceChange = (athleteId:string, idx: number, value: string)=>{
      // Only allow integer values or empty string
      if (/^\d*$/.test(value)) {
        // Update the specific input in the group while preserving other inputs
        setCurrentInputs(prev => {
          const updatedAthlete = prev[athleteId]?.map((input, i) => i === idx ? { ...input, distance: value } : input) || [];
          return { ...prev, [athleteId]: updatedAthlete };
        });
      }
    }

    const handleInputSubmission = async () => {
        const date = new Date().toISOString().split("T")[0];
        const resp = await GeneralService.massInput(currentInputs, groupId, date);
        if(resp.ok){
          setCurrentInputs({});
          fetchData();
        }
    }
  return (
    <View className="p-4 bg-gray-50 flex-1 min-h-screen">
      {athletes.map((athlete)=>(
      <View key={athlete[0]} className="bg-white rounded-xl shadow-md p-4 mb-4" >
        <Text className="text-2xl font-bold text-gray-800 mb-3">{athlete[1]}</Text>
        
        {workoutInputs[athlete[0]] && workoutInputs[athlete[0]].length > 0 && (
          <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-500 uppercase mb-2">Previous Entries</Text>
          {workoutInputs[athlete[0]].map((input, index) => (
            <TimeDistanceDisplay key={index} time={input.time} distance={input.distance} />
          ))}
          </View>
        )}

        <InputTracking
          currentInputs={currentInputs}
          setCurrentInputs={setCurrentInputs}
          identifierId={athlete[0]}
          handleTimeChange={handleTimeChange}
          handleDistanceChange={handleDistanceChange}
        />
      </View>
      ))}
      <TouchableOpacity className="bg-red-500 rounded-lg p-3 mt-2" onPress={handleInputSubmission}>
        <Text className="text-white text-center">Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

export default MassInput;