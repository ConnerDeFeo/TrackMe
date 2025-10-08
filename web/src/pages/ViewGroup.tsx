import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Workout } from "../common/types/workouts/Workout";
import GeneralService from "../services/GeneralService";
import DisplayWorkout from "../common/components/display/DisplayWorkout";
import { Variables } from "../common/constants/Variables";
import TrackmeButton from "../common/components/TrackmeButton";
import CoachGroupService from "../services/CoachGroupService";
import EditParticipants from "../common/components/groups/EditParticipants";
import GroupHeader from "../common/components/groups/GroupHeader";

// Component to view details for a specific group (participants and workouts)
const ViewGroup = () => {
    // Extract groupId and groupName from the URL parameters
    const { groupId, groupName } = useParams<{ groupId: string; groupName: string }>();

    // State: list of [id, name] for each participant
    const [participants, setParticipants] = useState<string[][]>([]);
    // State: array of workouts assigned to this group
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    // State: loading indicator while fetching data
    const [loading, setLoading] = useState(true);
    // State: toggle between view and edit mode for athletes
    const [editAthletesMode, setEditAthletesMode] = useState(false);

    const navigate = useNavigate();

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
        if(editAthletesMode){
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

    return (
        // Main container for group page
        <div className="h-screen bg-gray-50 max-w-6xl mx-auto">
            {/* Header: group name and counts */}
            <GroupHeader groupName={groupName || ''} />
            
            {/* Summary: number of athletes and workouts */}
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
                <EditParticipants
                    editAthletesMode={editAthletesMode}
                    participants={participants}
                    setParticipants={setParticipants}
                    groupId={groupId}
                />

                {/* Workouts section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            {Variables.Icons.workout} Workouts
                        </h2>
                        <TrackmeButton onClick={() => navigate(`schedule`)} className="w-45">
                            Schedule
                        </TrackmeButton>
                    </div>
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