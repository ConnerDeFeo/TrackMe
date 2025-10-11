import { useNavigate } from "react-router-dom";

const GroupHeader = ({groupName, groupId, settings}: {groupName: string, groupId: string, settings?: boolean}) => {
    const navigate = useNavigate();

    return (
        <div className="py-4 mx-auto text-center border-b trackme-border-gray max-w-6xl mx-auto relative">
            <button onClick={() => navigate(-1)} className="absolute left-0 top-0 text-gray-500 hover:text-trackme-blue focus:outline-none p-6">
                <img src="/assets/images/VectorDown.png" alt="Back" className="h-6 w-6 rotate-90"/>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{groupName}</h1>
            { settings &&
                <button onClick={() => navigate(`/groups/view-group/${encodeURIComponent(groupName)}/${groupId}/settings`)} className="absolute right-0 top-0 text-gray-500 hover:text-trackme-blue focus:outline-none p-6">
                    <img src="/assets/images/Settings.png" alt="Settings" className="h-6 w-6"/>
                </button>
            }
        </div>

    );
}

export default GroupHeader;