import type { WorkoutSummary } from "../../types/workouts/WorkoutSummary";
import TrackmeButton from "../TrackmeButton";

const WorkoutTemplatesSideBar = ({ workoutSummaries, selectedWorkout, handleWorkoutSelection, loading, handleCreateNewWorkout }:
    {workoutSummaries: WorkoutSummary[], selectedWorkout: any, handleWorkoutSelection: (workout: any) => void, loading: boolean, handleCreateNewWorkout: () => void}
) => {
  return (
    <div className="w-80 bg-white border-r trackme-border-gray flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b trackme-border-gray flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Workout Templates
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {workoutSummaries.length}{" "}
            {workoutSummaries.length === 1 ? "template" : "templates"}
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
          ) : workoutSummaries.length === 0 ? (
            // No templates placeholder
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm">No workout templates yet</p>
            </div>
          ) : (
            // Map over templates
            <div className="p-3 space-y-2">
              {workoutSummaries.map((summary, idx) => {
                const isSelected = selectedWorkout?.workoutId === `${summary.workoutId}`;
                return (
                <button
                  key={idx}
                  onClick={() => handleWorkoutSelection(summary.workoutId)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    isSelected
                      ? "trackme-bg-blue text-white shadow-md"
                      : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {/* Title */}
                  <h3
                    className={`font-semibold text-sm ${
                      isSelected
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {summary.title}
                  </h3>

                  {/* Description */}
                  {summary.description && (
                    <p
                      className={`text-xs mt-1 line-clamp-2 ${
                        isSelected
                          ? "text-blue-100"
                          : "text-gray-600"
                      }`}
                    >
                      {summary.description}
                    </p>
                  )}
                </button>
)})}
            </div>
          )}
        </div>
        <TrackmeButton className="m-6" onClick={handleCreateNewWorkout}>
          Create New Template
        </TrackmeButton>
      </div>
  );
}

export default WorkoutTemplatesSideBar;