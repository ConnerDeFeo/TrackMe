import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import DisplayWorkout from "../../components/DisplayWorkout";

//Pages that displays an athletes groupp for a given date
const ViewGroupAthlete = ()=>{
    const route = useRoute();
    const { groupName, groupId } = route.params as { groupName: string, groupId: string } || {};
    const [workout, setWorkout] = useState<Array<any>>();

    useEffect(() => {
        // Fetch workout data for the group
        const fetchWorkout = async () => {
            try {
                const response = await fetch(`API_URL/groups/${groupId}/workouts`);
                const data = await response.json();
                setWorkout(data);
            } catch (error) {
                console.error("Error fetching workout data:", error);
            }
        };

        fetchWorkout();
    }, [groupId]);

    return(
        <View>
            <Text>Group Name: {groupName}</Text>
            <Text>Group ID: {groupId}</Text>
            {workout && <DisplayWorkout workout={workout} />}
        </View>
    );
}

export default ViewGroupAthlete;