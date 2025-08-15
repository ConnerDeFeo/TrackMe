import { useEffect, useState } from "react";
import { Text } from "react-native";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";

const Inputs = ()=>{
    const [workoutInputs, setWorkoutInputs] = useState<Array<any>>([]);

    useEffect(()=>{
        const fetchWorkoutInputs = async () => {
            const resp = await AthleteWorkoutService.viewWorkoutInputs();
            if (resp.ok){
                const data = await resp.json();
                setWorkoutInputs(data);
            }
        };
        fetchWorkoutInputs();
    },[])

    return (
        <Text>testing inputs</Text>
    );
}

export default Inputs;