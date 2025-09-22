import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import GeneralService from "../services/GeneralService";
import usePersistentState from "../hooks/usePersistentState";

const MassInput = () => {
  const route = useRoute();
  const { groupId, groupName } = route.params as { groupId: string; groupName: string };
  const [workoutInputs, setWorkoutInputs] = useState<Record<string, {username:string, inputs:{distance:number, time:number}[]}>>({});
  const [currentInputs, setCurrentInputs] = 
    usePersistentState<Record<string, { time?: string | undefined; distance?: string | undefined}[]>>('current', {});

  //fetch athletes and workout inputs
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const workoutInputsResp = await GeneralService.viewGroupInputs(groupId);
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

  return (
    <View className="mt-4 px-4">
      {Object.entries(workoutInputs).map(([userId, userData]) => (
        <View key={userId} className="mb-4">
          <Text className="font-bold text-lg">{userData.username}</Text>
          {userData.inputs.map((input, index) => (
            <View key={index} className="ml-4 mt-2">
              <Text>Distance: {input.distance}</Text>
              <Text>Time: {input.time}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export default MassInput;