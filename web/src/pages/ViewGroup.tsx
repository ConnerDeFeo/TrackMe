import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Workout } from "../common/types/workouts/Workout";
import GeneralService from "../services/GeneralService";
import DisplayWorkout from "../common/components/display/DisplayWorkout";
import { Variables } from "../common/constants/Variables";
import TrackmeButton from "../common/components/TrackmeButton";
import CoachGroupService from "../services/CoachGroupService";

// Component to view details for a specific group (participants and workouts)
const ViewGroup = () => {
    // Extract groupId and groupName from the URL parameters
    const { groupId, groupName } = useParams<{ groupId: string; groupName: string }>();

    // State: list of [id, name] for each participant
    const [participants, setParticipants] = useState<string[][]>([]);
    const [absentParticipants, setAbsentParticipants] = useState<string[][]>([]);
    // State: array of workouts assigned to this group
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    // State: loading indicator while fetching data
    const [loading, setLoading] = useState(true);
    // State: toggle between view and edit mode for athletes
    const [editAthletesMode, setEditAthletesMode] = useState(false);

    // Fetch participants for the group from the API
    const fetchGroupAtheltes = async () => {
        const resp = await GeneralService.getAthletesForGroup(groupId!);
        if (resp.ok) {
            const data = await resp.json();
            setParticipants(data);
        } else {
            setParticipants([]);
        }
    };
    
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

    // Fetch workouts for the group from the API
    const fetchGroupWorkouts = async () => {
        const resp = await GeneralService.getGroupWorkout(groupId!);
        if (resp.ok) {
            const data = await resp.json();
            setWorkouts(data);
        } else {
            setWorkouts([]);
        }
    };

    // On mount or when groupId changes, load both participants and workouts
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchGroupAtheltes(), fetchGroupWorkouts()]);
            setLoading(false);
        };
        fetchData();
    }, [groupId]);

    const updateGroupAthletes = async (athleteIds: string[]) => {
        const resp = await CoachGroupService.updateGroupAthletes(groupId!, athleteIds);
        if (resp.ok) {
            await fetchGroupAtheltes();
        }
    };

    // Toggle between edit and view mode for athletes
    const handleEditAthlete = async () => {
        if(!editAthletesMode){
            await fetchAbsentGroupAthletes();
        }else{
            await updateGroupAthletes(participants.map(p => p[0]));
        }
        setEditAthletesMode(!editAthletesMode);
    };

    // Show a loading spinner while data is being fetched
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Loading group...</div>
            </div>
        );
    }

    console.log(absentParticipants)
    return (
        // Main container for group page
        <div className="h-screen bg-gray-50 overflow-y-auto max-w-6xl mx-auto">
            {/* Header: group name and counts */}
            <div className="py-4 mx-auto text-center border-b trackme-border-gray">
                <h1 className="text-2xl font-bold text-gray-900">{groupName}</h1>
                <p className="text-sm text-gray-500 mt-1">
                    {participants.length} participant{participants.length !== 1 ? 's' : ''} • {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="p-6">
                {/* Section header: Athletes with edit button */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        {Variables.Icons.friends} Athletes
                    </h2>
                    <TrackmeButton onClick={handleEditAthlete} className="w-45">
                        {editAthletesMode ? 'Save' : 'Edit Athletes'}
                    </TrackmeButton>
                </div>

                {/* Participants list or edit form */}
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
                                    {participants.length > 0 ? participants.map(([id, name]) => (
                                        <div
                                            key={id}
                                            className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
                                                    {name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">{name}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setParticipants(prev => prev.filter(p => p[0] !== id));
                                                    setAbsentParticipants(prev => [...prev, [id, name]]);
                                                }}
                                                className="cursor-pointer px-3 py-1 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
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
                                    {absentParticipants.length > 0 ? absentParticipants.map(([id, name]) => (
                                        <div
                                            key={id}
                                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                                                    {name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">{name}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setAbsentParticipants(prev => prev.filter(p => p[0] !== id));
                                                    setParticipants(prev => [...prev, [id, name]]);
                                                }}
                                                className="cursor-pointer px-3 py-1 text-xs font-medium text-trackme-blue bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
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

                {/* Workouts section */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        {Variables.Icons.workout} Workouts
                    </h2>
                    {workouts.length > 0 ? (
                        // Render each workout using DisplayWorkout component
                        <div className="gap-y-4">
                            {workouts.map((workout, index) => (
                                <DisplayWorkout key={index} workout={workout} />
                            ))}
                        </div>
                    ) : (
                        // Placeholder when no workouts
                        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                            No workouts assigned to this group yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewGroup;