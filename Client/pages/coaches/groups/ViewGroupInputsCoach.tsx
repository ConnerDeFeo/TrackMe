import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import GeneralService from "../../../services/GeneralService";
import TimeDistanceDisplay from "../../../components/TimeDistanceDisplay";

/**
 * ViewGroupInputsCoach component displays workout inputs for all athletes in a specific group.
 * It fetches athlete data and their corresponding workout inputs from a service.
 */
const ViewGroupInputsCoach = ()=>{
    // Get the current route to access navigation parameters.
    const route = useRoute();
    // Extract groupId from the route parameters.
    const { groupId } = route.params as { groupId: string };
    // State to store workout inputs, organized by athlete ID.
    const [workoutInputs, setWorkoutInputs] = useState<Record<string, {distance: number, time: number, inputId: number}[]>>({});
    // State to store the list of athletes in the group.
    const [athletes, setAthletes] = useState<string[][]>([]);

    // Effect hook to fetch data when the component mounts.
    useEffect(()=>{
        const fetchData = async () => {
            try {
                // Fetch workout inputs and athlete list for the group concurrently.
                const workoutInputsResp = await GeneralService.viewGroupInputs(groupId);
                const athletesResp = await GeneralService.getAthletesForGroup(groupId);

                // If athlete fetch is successful, parse and set the state.
                if(athletesResp.ok){
                    const athletesData = await athletesResp.json();
                    setAthletes(athletesData);
                }
                // If workout inputs fetch is successful, parse and set the state.
                if(workoutInputsResp.ok) {
                    const workoutInputData = await workoutInputsResp.json();
                    setWorkoutInputs(workoutInputData);
                }
            } catch (error) {
                // Log any errors that occur during the fetch process.
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    },[]) // Empty dependency array ensures this effect runs only once on mount.

    // Render the component UI.
    return(
        <View className="px-4 mt-4">
            {/* Map over the list of athletes to display each one's data. */}
            {athletes.map((athlete)=>(
            <View key={athlete[0]} className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4">
                {/* Display the athlete's name. */}
                <Text className="text-xl font-semibold text-black mb-4">{athlete[1]}</Text>
                {/* Map over the workout inputs for the current athlete and display them. */}
                {workoutInputs[athlete[0]]?.map((input, index) => (
                    <TimeDistanceDisplay key={index} time={input.time} distance={input.distance} />
                ))}
            </View>
            ))}
        </View>
    );
}

export default ViewGroupInputsCoach;