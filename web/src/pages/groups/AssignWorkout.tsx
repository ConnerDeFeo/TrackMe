import { useEffect, useState } from "react";
import CoachWorkoutService from "../../services/CoachWorkoutService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import WorkoutCreation from "../../common/components/workout/WorkoutCreation";
import type { Workout } from "../../common/types/workouts/Workout";
import TrackmeButton from "../../common/components/TrackmeButton";
import DateService from "../../services/DateService";

const AssignWorkout = () => {
    const { groupId, groupName, date } = useParams<{ groupId: string; groupName: string, date: string }>();
    const sunday = DateService.getSunday(new Date(date!));
    // Retrieve route params and navigation object
    const navigate = useNavigate();
    const location = useLocation();
    const workout = location.state?.workout;

    // State for storing fetched workout templates
    const [workoutTemplates, setWorkoutTemplates] = useState<Array<Workout>>([]);
    const [currentWorkout, setCurrentWorkout] = useState<Workout | undefined>(workout);
    const [importTemplateOpen, setImportTemplateOpen] = useState(false);

    // Fetch all workout templates when component mounts
    useEffect(() => {
        const fetchWorkouts = async () => {
            const response = await CoachWorkoutService.getWorkoutTemplates();
            if (response.ok) {
                const workoutTemplates = await response.json();
                setWorkoutTemplates(workoutTemplates || []);
            }
        };
        fetchWorkouts();
    }, []);

    // Assign the selected template workout to the group and navigate back on success
    const handleWorkoutCreation = async (workoutData: Workout) => {
        const response = await CoachWorkoutService.assignGroupWorkout(
            groupId!,
            workoutData,
            DateService.formatDate(sunday)
        );
        if (response.ok) {
            navigate(-1);
        }
    };

    const handleDeleteGroupWorkout = async () => {
        const resp = await CoachWorkoutService.deleteGroupWorkout(workout!.groupWorkoutId!);
        if (resp.ok) {
            navigate(-1);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen">
            { importTemplateOpen &&
                <>
                    <div className="fixed inset-0 opacity-50 bg-black flex justify-center items-center" onClick={() => setImportTemplateOpen(false)}/>
                    <div className="fixed inset-0 m-auto bg-white p-6 rounded-lg shadow-lg h-[80vh] w-[35vw] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 border-b trackme-border-gray py-2">Import Workout Template</h2>
                        <div className="gap-y-4">
                            {workoutTemplates.length === 0 && <p>No templates available.</p>}
                            {workoutTemplates.map((template) => (
                                <div key={template.workoutId} className="border p-4 rounded-lg hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setCurrentWorkout(undefined);
                                        setCurrentWorkout(template);
                                        setImportTemplateOpen(false);
                                    }}>
                                    <h3 className="text-lg font-semibold">{template.title}</h3>
                                    <p className="text-sm text-gray-600">{template.sections.length} sections</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>  
            }
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">{groupName}, {date}</h1>
                <TrackmeButton className="block ml-auto" onClick={() => setImportTemplateOpen(true)}>
                    Import Template
                </TrackmeButton>
            </div>
            <WorkoutCreation
                workout={currentWorkout}
                handleWorkoutCreation={handleWorkoutCreation}
                handleCancel={() => navigate(-1)}
            />
            {
                workout && workout.groupWorkoutId && (
                    <TrackmeButton red className="mt-4 w-full" onClick={handleDeleteGroupWorkout}>
                        Remove
                    </TrackmeButton>
                )
            }
        </div>
    );
}

export default AssignWorkout;