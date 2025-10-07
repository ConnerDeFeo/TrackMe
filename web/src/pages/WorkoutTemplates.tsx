import { useEffect, useState } from "react";
import CoachWorkoutService from "../services/CoachWorkoutService";
import DisplayWorkout from "../common/components/display/DisplayWorkout";

const WorkoutTemplates = () => {
  // Local state
  // workouts: list of fetched templates
  // selectedWorkout: currently highlighted template
  // loading: spinner flag
  const [workouts, setWorkouts] = useState<Array<any>>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load templates on mount
  useEffect(() => {
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

    fetchWorkouts();
  }, []);

  console.log(selectedWorkout)
  // Main render
  return (
    <div className="flex h-screen bg-gray-50 border-t trackme-border-gray">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r trackme-border-gray flex flex-col">
        {/* Header */}
        <div className="p-6 border-b trackme-border-gray">
          <h1 className="text-2xl font-bold text-gray-900">
            Workout Templates
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {workouts.length}{" "}
            {workouts.length === 1 ? "template" : "templates"}
          </p>
        </div>

        {/* Template List / Loading / Empty */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            // Loading spinner in sidebar
            <div className="p-6 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 trackme-border-blue mx-auto" />
              <p className="mt-2 text-sm">Loading workouts...</p>
            </div>
          ) : workouts.length === 0 ? (
            // No templates placeholder
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm">No workout templates yet</p>
            </div>
          ) : (
            // Map over templates
            <div className="p-3 space-y-2">
              {workouts.map((workout) => (
                <button
                  key={workout.workoutId}
                  onClick={() => setSelectedWorkout(workout)}
                  className={`w-full text-left p-4 rounded-lg transition-all cursor-pointer ${
                    selectedWorkout?.workoutId === workout.workoutId
                      ? "trackme-bg-blue text-white shadow-md"
                      : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {/* Title */}
                  <h3
                    className={`font-semibold text-sm ${
                      selectedWorkout?.workoutId === workout.workoutId
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {workout.title}
                  </h3>

                  {/* Description */}
                  {workout.description && (
                    <p
                      className={`text-xs mt-1 line-clamp-2 ${
                        selectedWorkout?.workoutId === workout.workoutId
                          ? "text-blue-100"
                          : "text-gray-600"
                      }`}
                    >
                      {workout.description}
                    </p>
                  )}

                  {/* Quick stats: sections and exercises */}
                  {workout.sections && (
                    <div
                      className={`flex items-center space-x-3 mt-2 text-xs ${
                        selectedWorkout?.workoutId === workout.workoutId
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      <span>{workout.sections.length} sections</span>
                      <span>•</span>
                      <span>
                        {workout.sections.reduce(
                          (total: number, section: any) =>
                            total + (section.exercises?.length || 0),
                          0
                        )}{" "}
                        exercises
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
          <DisplayWorkout workout={selectedWorkout} />
        </div>
      </div>
    </div>
  );
};

export default WorkoutTemplates;