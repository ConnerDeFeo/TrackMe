import { useEffect, useState } from "react";
import CoachWorkoutService from "../../services/CoachWorkoutService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import WorkoutCreation from "../../common/components/workout/WorkoutCreation";
import type { Workout } from "../../common/types/workouts/Workout";
import TrackmeButton from "../../common/components/TrackmeButton";
import WorkoutTemplatesPreview from "../../common/components/display/WorkoutTemplatesPreview";
import type { WorkoutSummary } from "../../common/types/workouts/WorkoutSummary";
import Modal from "../../common/components/Modal";
import type { SectionSummary } from "../../common/types/workouts/SectionSummary";

const AssignWorkout = () => {
    const { groupId, groupName, date } = useParams<{ groupId: string; groupName: string, date: string }>();
    // Retrieve route params and navigation object
    const navigate = useNavigate();
    const location = useLocation();
    const workout = location.state?.workout;

    // State for storing fetched workout templates
    const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutSummary[]>([]);
    const [sectionPreviews, setSectionPreviews] = useState<SectionSummary[]>([]);
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
        const fetchSections = async () => {
            const response = await CoachWorkoutService.previewSectionTemplates();
            if (response.ok) {
                const sectionPreviews = await response.json();
                setSectionPreviews(sectionPreviews || []);
            }
        };
        fetchWorkouts();
        fetchSections();
    }, []);

    // Assign the selected template workout to the group and navigate back on success
    const handleWorkoutCreation = async (workoutData: Workout) => {
        const response = await CoachWorkoutService.assignGroupWorkout(
            groupId!,
            workoutData,
            date!
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

    const fetchWorkout = async (workoutId: string) => {
        const resp = await CoachWorkoutService.getWorkout(workoutId);
        if (resp.ok) {
            const data = await resp.json();
            setCurrentWorkout(data);
            setImportTemplateOpen(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen">
            { importTemplateOpen &&
                <Modal onClose={() => setImportTemplateOpen(false)}>
                    <WorkoutTemplatesPreview
                        workoutSummaries={workoutTemplates}
                        selectedWorkoutId={currentWorkout?.workoutId}
                        handleWorkoutSelection={fetchWorkout}   
                    />
                </Modal>
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
                sectionsPreviews={sectionPreviews}
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