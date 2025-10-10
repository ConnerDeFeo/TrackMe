import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GeneralService from "../../services/GeneralService";
import TrackmeButton from "../../common/components/TrackmeButton";
import Modal from "../../common/components/Modal";
import CoachGroupService from "../../services/CoachGroupService";

const Groups = () => {
    const [groups, setGroups] = useState<string[][]>([]);
    const [creationMode, setCreationMode] = useState<boolean>(false);
    const [newGroupName, setNewGroupName] = useState<string>("");
    const navigate = useNavigate();

    const fetchGroups = useCallback(async () => {
        try {
            const resp = await GeneralService.getGroups();
            if(resp.ok){
            const data = await resp.json();
            setGroups(data);
            }
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        }
    }, []);

    //Fetch groups from the server
    useEffect(() => {
        fetchGroups();
    }, []);

    const handleNavigation = async (groupName: string, groupId: string) => {
        navigate(`view-group/${groupName}/${groupId}`); // Navigate to ViewGroup with query parameters
    };

    const handleGroupCreation = async () => {
        const resp = await CoachGroupService.createGroup(newGroupName);
        if(resp.ok){
            fetchGroups();
            setNewGroupName("");
            setCreationMode(false);
        } else {
            alert("Failed to create group");
        }
    }

    return (
        <div className="max-w-7xl mx-auto pt-4">
            <TrackmeButton onClick={() => setCreationMode(true)} className="mb-4 ml-auto block"> 
                Create New Group
            </TrackmeButton>
            {groups.map((group) => (
                <div 
                    key={group[1]}
                    onClick={() => handleNavigation(group[0], group[1])}
                    className="cursor-pointer p-4 mb-4 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50"
                >
                    {group[0]}
                </div>
            ))}
            {creationMode && 
                <Modal onClose={() => setCreationMode(false)}>
                    <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
                    <input 
                        type="text" 
                        className="border border-gray-300 rounded p-2 w-full mb-4" 
                        placeholder="Group Name" 
                        value={newGroupName} 
                        onChange={(e) => setNewGroupName(e.target.value)} 
                        onKeyDown={(e) => { if(e.key === 'Enter') handleGroupCreation(); }}
                    />
                    <div className="flex justify-between">
                        <TrackmeButton gray onClick={() => setCreationMode(false)}>
                            Close
                        </TrackmeButton>
                        <TrackmeButton onClick={handleGroupCreation}>
                            Create
                        </TrackmeButton>
                    </div>
                </Modal>
            }
        </div>
    );
}

export default Groups;