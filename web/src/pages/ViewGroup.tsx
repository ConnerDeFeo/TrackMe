import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Workout } from "../common/types/workouts/Workout";
import GeneralService from "../services/GeneralService";
import DisplayWorkout from "../common/components/display/DisplayWorkout";
import { Variables } from "../common/constants/Variables";
import TrackmeButton from "../common/components/TrackmeButton";

const ViewGroup = () => {
    const { groupId, groupName } = useParams<{ groupId: string, groupName: string }>();
    const [participants, setParticipants] = useState<string[][]>([]);
    const [workouts, setWorkouts] = useState<Array<Workout>>([]);
    const [loading, setLoading] = useState(true);
    const [editAthletesMode, setEditAthletesMode] = useState(false);

    const fetchGroupAtheltes = async () => {
        const resp = await GeneralService.getAthletesForGroup(groupId!);
        if(resp.ok){
            const data = await resp.json();
            setParticipants(data);
        } else {
            setParticipants([]);
        }
    }

    const fetchGroupWorkouts = async () => {
        const resp = await GeneralService.getGroupWorkout(groupId!);
        if(resp.ok){
            const data = await resp.json();
            setWorkouts(data);
        } else {
            setWorkouts([]);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchGroupAtheltes(), fetchGroupWorkouts()]);
            setLoading(false);
        };
        fetchData();
    }, [groupId]);

    const handleEditAthlete = () => {
        setEditAthletesMode(!editAthletesMode);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Loading group...</div>
            </div>
        );
    }

    return(
        <div className="h-screen bg-gray-50 overflow-y-auto max-w-6xl mx-auto">
            {/* Header */}
            <div className="py-4 mx-auto text-center border-b trackme-border-gray">
                <h1 className="text-2xl font-bold text-gray-900">{groupName}</h1>
                <p className="text-sm text-gray-500 mt-1">
                    {participants.length} participant{participants.length !== 1 ? 's' : ''} • {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        {Variables.Icons.friends} Athletes
                    </h2>
                    <TrackmeButton onClick={handleEditAthlete} className="w-40">
                        {editAthletesMode ? `Save` : `Edit Athletes`}
                    </TrackmeButton>
                </div>
                {/* Participants Section */}
                <div className="mb-8">
                    { editAthletesMode ?
                    <></> 
                    :
                    (
                        <>
                            {participants.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {participants.map((participant) => (
                                        <div
                                            key={participant[0]}
                                            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:border-trackme-blue transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-trackme-blue font-semibold">
                                                {participant[1].charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{participant[1]}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                                    No participants in this group yet
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Workouts Section */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        {Variables.Icons.workout} Workouts
                    </h2>
                    {workouts.length > 0 ? (
                        <div className="gap-y-4">
                            {workouts.map((workout, index) => (
                                <DisplayWorkout key={index} workout={workout} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                            No workouts assigned to this group yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewGroup;