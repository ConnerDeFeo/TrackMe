import { useParams, useNavigate } from "react-router-dom";
import type { Workout } from "../../common/types/workouts/Workout";
import { useEffect, useState } from "react";
import DateService from "../../services/DateService";
import GeneralService from "../../services/GeneralService";
import GroupHeader from "../../common/components/groups/GroupHeader";
import CollapsibleWorkoutDisplay from "../../common/components/display/workout/CollapsibleWorkoutDisplay";

const GroupSchedule = () => {
    const { groupId, groupName } = useParams<{ groupId: string; groupName: string }>();
    const navigate = useNavigate();
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [workouts, setWorkouts] = useState<Record<string, Workout[]>>({});
    const [loading, setLoading] = useState(true);

    // Compute the Sunday and Saturday of the current week
    const sunday = DateService.getSunday(currentWeek);
    const saturday = DateService.getSaturday(sunday);

    // Fetch the weekly schedule for the group
    const fetchWorkouts = async () => {
        setLoading(true);
        const resp = await GeneralService.getWeeklyGroupSchedule(
            groupId!,
            DateService.formatDate(sunday)
        );
        if (resp.ok) {
            const data = await resp.json();
            setWorkouts(data);
        } else {
            setWorkouts({});
        }
        setLoading(false);
    };

    // Re-fetch workouts when the week or group changes
    useEffect(() => {
        fetchWorkouts();
    }, [currentWeek, groupId]);

    // Navigate one week back
    const navigateBack = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeek(newDate);
    };

    // Navigate one week forward
    const navigateForward = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeek(newDate);
    };

    // Navigate to assign workout page
    const handleAddWorkout = (dateKey: string) => {
        navigate(`assign-workout/${dateKey}`);
    };

    const handleWorkoutClick = (workout: Workout, dateKey: string) => {
        navigate(`assign-workout/${dateKey}`, { state: { workout,  } });
    }

    return (
        <>
            {/* Header */}
            <GroupHeader groupName={groupName || ''} groupId={groupId || ''} settings/>
            
            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-6">
                {/* Week Navigation */}
                <div className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <button
                        onClick={navigateBack}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Previous Week
                    </button>
                    <p className="text-lg font-semibold text-gray-800">
                        {sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {saturday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <button
                        onClick={navigateForward}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Next Week
                    </button>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trackme-blue mx-auto mb-4"></div>
                        Loading schedule...
                    </div>
                ) : (
                    /* Days of the Week */
                    <div className="space-y-4">
                        {Array.from({ length: 7 }, (_, i) => {
                            const day = new Date(sunday);
                            day.setDate(sunday.getDate() + i);
                            const dateKey = DateService.formatDate(day);
                            const dayWorkouts = workouts[dateKey] || [];

                            return (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                                >
                                    {/* Day Header */}
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {day.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </h3>
                                        <button
                                            onClick={() => handleAddWorkout(dateKey)}
                                            className="px-4 py-2 text-sm font-medium text-trackme-blue border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            + Add Workout
                                        </button>
                                    </div>

                                    {/* Workouts List */}
                                    {dayWorkouts.length > 0 ? (
                                        <div className="space-y-3">
                                            {dayWorkouts.map((workout, idx) => (
                                                <CollapsibleWorkoutDisplay 
                                                    key={idx} 
                                                    workout={workout} 
                                                    onClick={() => handleWorkoutClick(workout, dateKey)} 
                                                    onClickText="Edit Workout"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-center py-6">
                                            No workouts scheduled
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default GroupSchedule;