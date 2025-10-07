import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, TextInput, Pressable, View } from "react-native";
import GeneralService from "../services/GeneralService";
import usePersistentState from "../common/hooks/usePersistentState";
import InputTracking from "../common/components/InputTracking";
import TimeDistanceDisplay from "../common/components/display/TimeDistanceDisplay";
import DateService from "../services/DateService";
import UserDisplay from "../common/components/display/UserDisplay";
import { Input } from "../common/types/inputs/Input";
import InputDisplay from "../common/components/display/InputDisplay";

const MassInput = () => {
  const route = useRoute();
  const { groupId } = route.params as { groupId: string; };
  const [workoutInputs, setWorkoutInputs] = useState<Record<string, {distance: number, time: number, inputId:number}[]>>({});
  const [athletes, setAthletes] = useState<string[][]>([]);
  // Track current input values for each given group { groupId : [time/distance, time/distance] }
  const [currentInputs, setCurrentInputs] = 
  usePersistentState<Record<string, Input[]>>('currentMassInputs', {});

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
            return { ...prev, [athleteId]: updatedAthlete } as Record<string, Input[]>;
        });
    }

    // Handle distance input changes with validation (integers only)
    const handleDistanceChange = (athleteId:string, idx: number, value: string)=>{
      // Only allow integer values or empty string
      if (/^\d*$/.test(value)) {
        // Update the specific input in the group while preserving other inputs
        setCurrentInputs(prev => {
          const updatedAthlete = prev[athleteId]?.map((input, i) => i === idx ? { ...input, distance: value } : input) || [];
          return { ...prev, [athleteId]: updatedAthlete } as Record<string, Input[]>;
        });
      }
    }

    const handleRestTimeChange = (athleteId:string, idx: number, value: string)=>{
      // Only allow integer values or empty string
      if (/^\d*$/.test(value)) {
        // Update the specific input in the group while preserving other inputs
        setCurrentInputs(prev => {
          const updatedAthlete = prev[athleteId]?.map((input, i) => i === idx ? { ...input, restTime: value } : input) || [];
          return { ...prev, [athleteId]: updatedAthlete } as Record<string, Input[]>;
        });
      }
    }

    const handleInputSubmission = async () => {
        const date = DateService.formatDate(new Date());
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
        <UserDisplay firstName={athlete[2]} lastName={athlete[3]} username={athlete[1]} className="mb-4"/>
        
        {workoutInputs[athlete[0]] && workoutInputs[athlete[0]].length > 0 && (
          <View className="mb-4 gap-y-2">
            {workoutInputs[athlete[0]].map((input, index) => (
              <InputDisplay key={index} input={input} />
            ))}
          </View>
        )}

        <InputTracking
          currentInputs={currentInputs}
          setCurrentInputs={setCurrentInputs}
          identifierId={athlete[0]}
          handleTimeChange={handleTimeChange}
          handleDistanceChange={handleDistanceChange}
          handleRestChange={handleRestTimeChange}
        />
      </View>
      ))}
      <Pressable className="trackme-bg-blue rounded-lg p-3 mt-2" onPress={handleInputSubmission}>
        <Text className="text-white text-center">Submit</Text>
      </Pressable>
    </View>
  );
}

export default MassInput;