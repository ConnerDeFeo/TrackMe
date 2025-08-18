import { useEffect, useState } from "react";
import { Text,ScrollView, View } from "react-native";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";
import GeneralService from "../../services/GeneralService";

//Page where athletes input times
const Inputs = ()=>{
    const [groups,setGroups] = useState<string[][]>([]);
    const [workoutInputs, setWorkoutInputs] = useState<Array<any>>([]);

    // Grab all current inputs on load
    useEffect(()=>{
        const fetchWorkoutInputs = async () => {
            const resp = await AthleteWorkoutService.viewWorkoutInputs();
            if (resp.ok){
                const data = await resp.json();
                setWorkoutInputs(data);
            }
        };
        const fetchGroups = async () => {
            const resp = await GeneralService.getGroups();
            if (resp.ok){
                const groups = await resp.json();
                setGroups(groups);
            }
        };
        fetchWorkoutInputs();
        fetchGroups();
    },[]);

    return (
        <View>
            {groups.map(group => (
                <Text key={group[1]} className="border my-5">{group[0]}</Text>
            ))}
        </View>
    );
}

export default Inputs;