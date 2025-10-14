import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import GeneralService from "../services/GeneralService";
import usePersistentState from "../common/hooks/usePersistentState";
import DateService from "../services/DateService";
import UserDisplay from "../common/components/display/UserDisplay";
import { Input } from "../common/types/inputs/Input";
import InputDisplay from "../common/components/display/input/InputDisplay";
import TrackMeButton from "../common/components/display/TrackMeButton";
import RelationService from "../services/RelationService";
import InputTracking from "../common/components/InputTracking";

const MassInput = () => {
  const [workoutInputs, setWorkoutInputs] = useState<Record<string, Input[]>>({});
  const [athletes, setAthletes] = useState<{firstName:string, lastName:string, relationId:string, username:string}[]>([]);
  // Track current input values for each given group { groupId : [time/distance, time/distance] }
  const [currentInputs, setCurrentInputs] = 
  usePersistentState<Record<string, Input[]>>('currentMassInputs', {});

  //fetch athletes and workout inputs
  const fetchData = async () => {
      try {
        const athletesResp = await RelationService.getMutualAthletes();
        const workoutResp = await GeneralService.getMutualInputs(DateService.formatDate(new Date()));
        if(athletesResp.ok){
          const athletesData = await athletesResp.json();
          setAthletes(athletesData);
        }
        if(workoutResp.ok){
          const workoutData = await workoutResp.json();
          setWorkoutInputs(workoutData);
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

    const handleSetCurrentInputs = (athleteId:string, inputs: Input[]) => {
      setCurrentInputs(prev => ({
        ...prev,
        [athleteId]: inputs
      }));
    }

    const handleInputSubmission = async () => {
        const date = DateService.formatDate(new Date());
        const resp = await GeneralService.massInput(currentInputs, date);
        if(resp.ok){
          setCurrentInputs({});
          fetchData();
        }
    }
    
  return (
    <View className="p-4 bg-gray-50 flex-1 min-h-screen">
      {athletes.map((athlete)=>(
        <View key={athlete.relationId} className="bg-white rounded-xl shadow-md p-4 mb-4" >
          <UserDisplay firstName={athlete.firstName} lastName={athlete.lastName} username={athlete.username} className="mb-4"/>

          {workoutInputs[athlete.relationId] && workoutInputs[athlete.relationId].length > 0 && (
            <View className="mb-4 gap-y-2">
              <Text>Submitted Entries</Text>
              {workoutInputs[athlete.relationId].map((input, index) => (
                <InputDisplay key={index} input={input} />
              ))}
            </View>
          )}
          <InputTracking
            currentInputs={currentInputs[athlete.relationId]}
            setCurrentInputs={(inputs: Input[]) => handleSetCurrentInputs(athlete.relationId, inputs)}
            handleTimeChange={(idx, text) => handleTimeChange(athlete.relationId, idx, text)}
            handleDistanceChange={(idx, text) => handleDistanceChange(athlete.relationId, idx, text)}
            handleRestChange={(idx, text) => handleRestTimeChange(athlete.relationId, idx, text)}
          />
        </View>
      ))}
      <TrackMeButton text="Submit" onPress={handleInputSubmission} className="mt-2"/>
    </View>
  );
}

export default MassInput;