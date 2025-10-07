import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoachWorkoutService from "../services/CoachWorkoutService";
import DisplayWorkout from "../common/components/DisplayWorkout";

const WorkoutTemplates = () => {
  // Hook to navigate between screens
  const navigate = useNavigate();

  // State to store fetched workout templates
  const [workouts, setWorkouts] = useState<Array<any>>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // On mount, fetch all workout templates from the service
  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      const response = await CoachWorkoutService.getWorkoutTemplates();
      if (response.ok) {
        // Parse JSON and update state
        const data = await response.json();
        console.log(data);
        setWorkouts(data || []);
        // Automatically select the first workout if available
        if (data && data.length > 0) {
          setSelectedWorkout(data[0]);
        }
      }
      setLoading(false);
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Workout Templates</h1>
          <p className="text-sm text-gray-600 mt-1">
            {workouts.length} {workouts.length === 1 ? 'template' : 'templates'}
          </p>
        </div>

        {/* Workout List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 trackme-border-blue mx-auto"></div>
              <p className="mt-2 text-sm">Loading workouts...</p>
            </div>
          ) : workouts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm">No workout templates yet</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {workouts.map((workout) => (
                <button
                  key={workout.workoutId}
                  onClick={() => setSelectedWorkout(workout)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    selectedWorkout?.workoutId === workout.workoutId
                      ? 'trackme-bg-blue text-white shadow-md'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <h3 className={`font-semibold text-sm ${
                    selectedWorkout?.workoutId === workout.workoutId
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}>
                    {workout.title}
                  </h3>
                  {workout.description && (
                    <p className={`text-xs mt-1 line-clamp-2 ${
                      selectedWorkout?.workoutId === workout.workoutId
                        ? 'text-blue-100'
                        : 'text-gray-600'
                    }`}>
                      {workout.description}
                    </p>
                  )}
                  {workout.sections && (
                    <div className={`flex items-center space-x-3 mt-2 text-xs ${
                      selectedWorkout?.workoutId === workout.workoutId
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}>
                      <span>{workout.sections.length} sections</span>
                      <span>•</span>
                      <span>
                        {workout.sections.reduce((total: number, section: any) => 
                          total + (section.exercises?.length || 0), 0
                        )} exercises
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
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 trackme-border-blue mx-auto"></div>
              <p className="mt-4">Loading workout...</p>
            </div>
          </div>
        ) : selectedWorkout ? (
          <div className="p-6 max-w-4xl mx-auto">
            <DisplayWorkout workout={selectedWorkout} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <svg
                className="w-16 h-16 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-4 text-lg font-medium">No workout selected</p>
              <p className="mt-2 text-sm">Select a workout from the sidebar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutTemplates;