import { useEffect, useState } from "react";
import CoachGroupService from "../../../services/CoachGroupService";
import UserDisplay from "../display/UserDisplay";

const EditParticipants = ({editAthletesMode, participants, setParticipants, groupId}:
    {
        editAthletesMode: boolean, 
        participants: Array<string[]>, 
        setParticipants: React.Dispatch<React.SetStateAction<Array<string[]>>>, 
        groupId: string | undefined,
    }
) => {
    const [absentParticipants, setAbsentParticipants] = useState<string[][]>([]);

    const fetchAbsentGroupAthletes = async () => {
        const resp = await CoachGroupService.getAbsentGroupAthletes(groupId!);
        if (resp.ok) {
            const data = await resp.json();
            setAbsentParticipants(data);
        }
        else{
            setAbsentParticipants([]);
        }
    };

    useEffect(() => {
        if(editAthletesMode){
            fetchAbsentGroupAthletes();
        }
    }, [editAthletesMode]);

    return (
        <div className="mb-8">
            {editAthletesMode ? (
                // Edit mode: show current and absent participants
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Current Participants */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                        <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            In Group ({participants.length})
                        </h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {participants.length > 0 ? participants.map(([id, username, firstName, lastName, accountType]) => (
                                <div
                                    key={id}
                                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                                >
                                    <UserDisplay username={username} firstName={firstName} lastName={lastName}/>
                                    <button
                                        onClick={() => {
                                            setParticipants(prev => prev.filter(p => p[0] !== id));
                                            setAbsentParticipants(prev => [...prev, [id, username, firstName, lastName, accountType]]);
                                        }}
                                        className="px-3 py-1 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    No athletes in group
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Absent Participants */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                        <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            Available Athletes ({absentParticipants.length})
                        </h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {absentParticipants.length > 0 ? absentParticipants.map(([id, username, firstName, lastName, accountType]) => (
                                <div
                                    key={id}
                                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                >
                                    <UserDisplay username={username} firstName={firstName} lastName={lastName}/>
                                    <button
                                        onClick={() => {
                                            setAbsentParticipants(prev => prev.filter(p => p[0] !== id));
                                            setParticipants(prev => [...prev, [id, username, firstName, lastName, accountType]]);
                                        }}
                                        className="px-3 py-1 text-xs font-medium text-trackme-blue bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    No available athletes
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : participants.length > 0 ? (
                // Display grid of participant cards
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {participants.map(([id, name]) => (
                        <div
                            key={id}
                            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:border-trackme-blue transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-trackme-blue font-semibold">
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <p className="font-medium text-gray-900 truncate">{name}</p>
                        </div>
                    ))}
                </div>
            ) : (
                // Placeholder when no participants
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                    No participants in this group yet
                </div>
            )}
        </div>
    );
}

export default EditParticipants;