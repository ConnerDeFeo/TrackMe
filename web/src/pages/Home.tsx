import { useEffect, useState } from "react";
import GeneralService from "../services/GeneralService";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [groups, setGroups] = useState<string[][]>([]);
    const navigate = useNavigate();

    //Fetch groups from the server
    useEffect(() => {
        const fetchGroups = async () => {
        try {
            const resp = await GeneralService.getGroups();
            if(resp.ok){
            const data = await resp.json();
            setGroups(data);
            }
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        }
        };
        fetchGroups();
    }, []);

    const handleNavigation = async (groupName: string, groupId: string) => {
        navigate(`view-group/${groupName}/${groupId}`); // Navigate to ViewGroup with query parameters
    };
    return (
        <div className="max-w-7xl mx-auto">
            {groups.map((group) => (
                <div 
                    key={group[1]}
                    onClick={() => handleNavigation(group[0], group[1])}
                    className="cursor-pointer p-4 m-4 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50"
                >
                    {group[0]}
                </div>
            ))}
        </div>
    );
};

export default Home;