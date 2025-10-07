import { useEffect, useState } from "react";
import CoachWorkoutService from "../services/CoachWorkoutService";
import DisplayWorkout from "../common/components/display/DisplayWorkout";
import TrackmeButton from "../common/components/TrackmeButton";
import WorkoutTemplatesSideBar from "../common/components/display/WorkoutTemplatesSideBar";
import WorkoutCreation from "../common/components/workout/WorkoutCreation";
import type { Workout } from "../common/types/workouts/Workout";

const WorkoutTemplates = () => {
  // Local state
  // workouts: list of fetched templates
  // selectedWorkout: currently highlighted template
  // loading: spinner flag
  const [workouts, setWorkouts] = useState<Array<any>>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [inCreationMode, setInCreationMode] = useState(false);

  const fetchWorkouts = async () => {
      setLoading(true);
      const response = await CoachWorkoutService.getWorkoutTemplates();
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data || []);
        // auto-select first template if available
        if (data && data.length > 0) {
          setSelectedWorkout(data[0]);
        }
      }
      setLoading(false);
  };

  // Load templates on mount
  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSelectWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    setInCreationMode(false);
  }

  const handleWorkoutCreation = async (workout: Workout) => {
    const resp = await CoachWorkoutService.createWorkoutTemplate(workout);
    if(resp.ok){
      await fetchWorkouts();
      setInCreationMode(false);
    }
  }

  // Main render
  return (
    <div className="flex border-t trackme-border-gray h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <WorkoutTemplatesSideBar
        workouts={workouts}
        selectedWorkout={selectedWorkout}
        setSelectedWorkout={handleSelectWorkout}
        loading={loading}
      />
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
          {inCreationMode ? 
            (
              <WorkoutCreation workout={selectedWorkout} handleWorkoutCreation={handleWorkoutCreation} />
            )
            :
            (
              <>
                <DisplayWorkout workout={selectedWorkout} />
                <TrackmeButton onClick={() => setInCreationMode(true)} className="w-full mt-6">
                  Edit Workout
                </TrackmeButton>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default WorkoutTemplates;