import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewGroup = () => {
    const { groupId, groupName } = useParams<{ groupId: string, groupName: string }>();
    const [participants, setParticipants] = useState<string[]>([]);
    const [workouts, setWorkouts] = useState<Array<any>>([]);

    const fetchGroupAtheltes = async () => {
        // Fetch athletes for the group using groupId
        console.log("Fetching athletes for group:", groupId);
    }

    const fetchGroupWorkouts = async () => {
        // Fetch workouts for the group using groupId
        console.log("Fetching workouts for group:", groupId);
    }

    useEffect(() => {
        fetchGroupAtheltes();
        fetchGroupWorkouts();
    }, [groupId]);

    return(
        <div>ViewGroup Page {groupName} - {groupId}</div>
    );
}

export default ViewGroup;