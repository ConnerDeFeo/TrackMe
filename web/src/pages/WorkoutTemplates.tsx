import { useEffect, useState } from "react";
import CoachWorkoutService from "../services/CoachWorkoutService";
import DisplayWorkout from "../common/components/display/DisplayWorkout";
import TrackmeButton from "../common/components/TrackmeButton";
import WorkoutTemplatesSideBar from "../common/components/display/WorkoutTemplatesSideBar";
import WorkoutCreation from "../common/components/workout/WorkoutCreation";
import type { Workout } from "../common/types/workouts/Workout";
import type { WorkoutSummary } from "../common/types/workouts/WorkoutSummary";

const WorkoutTemplates = () => {
  // State: list of workouts fetched from the server
  const [workoutSummaries, setWorkoutSummaries] = useState<WorkoutSummary[]>([]);
  // State: currently selected workout template
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  // State: loading flag for spinners/UI feedback
  const [loading, setLoading] = useState(true);
  // State: whether we're in "create or edit" mode
  const [inCreationMode, setInCreationMode] = useState(false);

  const fetchWorkout = async (workoutId: string) => {
    const resp = await CoachWorkoutService.getWorkout(workoutId);
    if (resp.ok) {
      const data = await resp.json();
      setSelectedWorkout(data);
    }else{
      setSelectedWorkout(null);
    }
  };

  // Fetch workout templates from API and update state
  const fetchWorkouts = async () => {
    setLoading(true);
    const response = await CoachWorkoutService.getWorkoutTemplates();
    if (response.ok) {
      const data = await response.json();
      setWorkoutSummaries(data || []);
      // Auto-select the first workout if available, otherwise clear selection
      if (data && data.length > 0) {
        fetchWorkout(data[0].workoutId); 
      } 
      else {
        // On error, clear list and selection
        setWorkoutSummaries([]);
        setSelectedWorkout(null);
      }
      setLoading(false);
    };
  }

  // Load templates on component mount
  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Handler: select a workout from the sidebar
  const handleSelectWorkout = async (workoutId: string) => {
    await fetchWorkout(workoutId);
    setInCreationMode(false);
  };

  // Handler: save (create or update) a workout template
  const handleWorkoutSave = async (workout: Workout) => {
    const resp = await CoachWorkoutService.createWorkoutTemplate(workout);
    if (resp.ok) {
      await fetchWorkouts();
      setInCreationMode(false);
    }
  };

  // Handler: delete a workout template by ID
  const handleWorkoutDeletion = async (workoutId: string) => {
    setLoading(true);
    const resp = await CoachWorkoutService.deleteWorkoutTemplate(workoutId);
    if (resp.ok) {
      await fetchWorkouts();
      setInCreationMode(false);
    }
  };

  // Handler: initialize creation of a new workout template
  const handleCreateNewWorkout = () => {
    const newWorkout= { title: '' };
    setWorkoutSummaries(prev => [...prev, newWorkout]);
    setSelectedWorkout(newWorkout);
    setInCreationMode(true);
  };

  // Handler: cancel workout creation and revert state
  const handleWorkoutCreationCancel = () => {
    // If it's a new unsaved workout, remove it from the list
    if (!selectedWorkout?.workoutId) {
      setWorkoutSummaries(prev => prev.filter(w => w !== selectedWorkout));
      setSelectedWorkout(workoutSummaries.length > 0 ? workoutSummaries[0] : null);
    }
    setInCreationMode(false);
  };

  console.log(selectedWorkout);
  return (
    <div className="flex border-t trackme-border-gray h-[calc(100vh-64px)]">
      {/* Sidebar with list of workout templates */}
      <WorkoutTemplatesSideBar
        workoutSummaries={workoutSummaries}
        selectedWorkout={selectedWorkout}
        handleWorkoutSelection={handleSelectWorkout}
        handleCreateNewWorkout={handleCreateNewWorkout}
        loading={loading}
      />

      {/* Content area: either creation form or display + actions */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
          {workoutSummaries.length > 0 && selectedWorkout && (
            inCreationMode ? (
              // Creation / edit form
              <WorkoutCreation
                workout={selectedWorkout}
                handleWorkoutCreation={handleWorkoutSave}
                handleCancel={handleWorkoutCreationCancel}
              />
            ) : (
              // Display existing workout and action buttons
              <>
                <DisplayWorkout workout={selectedWorkout} />
                <div className="flex space-x-4 mt-6">
                  {selectedWorkout.workoutId && (
                    <TrackmeButton
                      red
                      className="w-full"
                      onClick={() => handleWorkoutDeletion(selectedWorkout.workoutId!)}
                    >
                      Delete Workout
                    </TrackmeButton>
                  )}
                  <TrackmeButton
                    onClick={() => setInCreationMode(true)}
                    className="w-full"
                  >
                    Edit Workout
                  </TrackmeButton>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutTemplates;