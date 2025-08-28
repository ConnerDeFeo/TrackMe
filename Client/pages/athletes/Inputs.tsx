import { useEffect, useState } from "react";
import { Text,ScrollView, View } from "react-native";
import GeneralService from "../../services/GeneralService";
import usePersistentState from "../../hooks/usePersistentState";
import RenderGroupInputs from "../../components/athletes/RenderGroupInputs";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";

//Page where athletes input times
const Inputs = ()=>{
    const [groups,setGroups] = useState<string[][]>([]);

    // Track current input values for each given group { groupId : [time/distance, time/distance] }
    const [currentInputs, setCurrentInputs] = 
    usePersistentState<Record<string, { time?: string | undefined; distance?: string | undefined}[]>>('current', {});

    // Store previously submitted workout inputs organized by date and group
    const [submittedInputs, setSubmittedInputs] = useState<Record<number, { time?: string; distance?: string }[]>>({});

    // Fetch previously submitted workout inputs from the server
    const fetchSubmittedInputs = async () => {
        const resp = await AthleteWorkoutService.viewWorkoutInputs();
        if (resp.ok){
            const inputs = await resp.json();
            console.log(inputs)
            setSubmittedInputs(inputs);
        }
    };

    // Initialize component by fetching groups and submitted inputs on mount
    useEffect(()=>{
        const fetchGroups = async () => {
            const resp = await GeneralService.getGroups();
            if (resp.ok){
                const groups = await resp.json();
                setGroups(groups);
            }
        };
        fetchGroups();
        fetchSubmittedInputs();
    },[]);

    // Handle time input changes with validation (numbers only)
    const handleTimeChange = (groupId:string, idx: number, value: string)=>{
        let updatedValue = ''
        // Only allow numeric values or empty string
        if(!isNaN(Number(value)) || value === ''){
            updatedValue = value
        }
        // Update the specific input in the group while preserving other inputs
        setCurrentInputs(prev => {
            const updatedGroup = prev[groupId]?.map((input, i) => i === idx ? { ...input, time: updatedValue } : input) || [];
            return { ...prev, [groupId]: updatedGroup };
        });
    }

    // Handle distance input changes with validation (numbers only)
    const handleDistanceChange = (groupId:string, idx: number, value: string)=>{
        let updatedValue = ''
        // Only allow numeric values or empty string
        if(!isNaN(Number(value)) || value === ''){
            updatedValue = value
        }
        // Update the specific input in the group while preserving other inputs
        setCurrentInputs(prev => {
            const updatedGroup = prev[groupId]?.map((input, i) => i === idx ? { ...input, distance: updatedValue } : input) || [];
            return { ...prev, [groupId]: updatedGroup };
        });
    }
    return (
        <ScrollView className="flex-1">
            <View className="mt-16 px-6 pb-8">
                <Text className="text-2xl font-bold text-gray-800 mb-6">Inputs</Text>
                {/* Render input components for each group */}
                {groups.map(group => (
                    <RenderGroupInputs
                        onSubmit={fetchSubmittedInputs}
                        submitedInputs={submittedInputs}
                        groupName={group[0]}
                        key={group[1]}
                        groupId={group[1]}
                        currentInputs={currentInputs}
                        handleTimeChange={handleTimeChange}
                        handleDistanceChange={handleDistanceChange}
                        setCurrentInputs={setCurrentInputs}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

export default Inputs;