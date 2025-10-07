import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../common/context/AuthContext";
import GeneralService from "../services/GeneralService";
import { AccountType } from "../common/constants/Enums";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [groups, setGroups] = useState<string[][]>([]);
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const accountType = context[0];

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
        <>
            {groups.map((group) => (
                <div 
                    key={group[1]}
                    onClick={() => handleNavigation(group[0], group[1])}
                    className="cursor-pointer p-4 m-4 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50"
                >
                    {group[0]}
                </div>
            ))}
        </>
    );
};

export default Home;