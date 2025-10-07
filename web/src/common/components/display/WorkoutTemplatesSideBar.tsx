const WorkoutTemplatesSideBar = ({ workouts, selectedWorkout, setSelectedWorkout, loading }:
    {workouts: Array<any>, selectedWorkout: any, setSelectedWorkout: (workout: any) => void, loading: boolean}
) => {
  return (
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
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}

export default WorkoutTemplatesSideBar;