import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import GeneralService from "../services/GeneralService";
import usePersistentState from "../hooks/usePersistentState";

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
        
    }

    // Handle distance input changes with validation (numbers only)
    const handleDistanceChange = (athleteId:string, idx: number, value: string)=>{
        
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

            {/* Render all existing input pairs for this group */}
            {currentInputs[groupId]?.map((input, idx) => (
                <View key={idx} className="flex flex-row justify-between items-center mb-2">
                    {/* Time input field */}
                    <TextInput
                        placeholder="Enter time"
                        keyboardType="numeric"
                        value={input?.time}
                        className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                        onChangeText={text => handleTimeChange(groupId, idx, text)}
                    />
                    {/* Distance input field */}
                    <TextInput
                        placeholder="Enter distance"
                        keyboardType="numeric"
                        className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                        value={input?.distance}
                        onChangeText={text => handleDistanceChange(groupId, idx, text)}
                    />
                    {/* Units label */}
                    <Text>Meters</Text>
                </View>
            ))}

            <View className="flex flex-row items-center justify-between">
              {/* Button to remove last input */}
              <TouchableOpacity
                  className="bg-[#E63946] rounded-lg p-2 w-[45%]"
                  onPress={() => {
                  setCurrentInputs(prev => {
                      const updatedGroup = prev[groupId]?.slice(0, -1) || [];
                      return { ...prev, [groupId]: updatedGroup };
                  });
              }}>
                  <Text className="text-white text-center">Remove</Text>
              </TouchableOpacity>

              {/* Button to add new input pair to the group */}
              <TouchableOpacity 
                  className="bg-[#E63946] rounded-lg p-2 w-[45%]"
                  onPress={() => {
                      // Initialize or update the inputs array for this group
                      let updatedInputs: { time?: string; distance?: string }[] = [];
                      
                      // Check if group has existing inputs, if not create first input
                      if (currentInputs[groupId] === undefined) {
                          updatedInputs = [{ time: '', distance: '' }];
                      } else {
                          // Add new empty input to existing inputs
                          updatedInputs = [...currentInputs[groupId], { time: '', distance: '' }];
                      }
                      
                      // Update state with new inputs array for this group
                      setCurrentInputs(prev => ({ ...prev, [groupId]: updatedInputs }));
                  }
              }>
                  <Text className="text-white text-center">Add</Text>
              </TouchableOpacity>
          </View>
        </View>
      ))}
  </View>
  );
}

export default MassInput;