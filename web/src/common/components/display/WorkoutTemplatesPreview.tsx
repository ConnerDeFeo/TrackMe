import type { WorkoutSummary } from "../../types/workouts/WorkoutSummary";

const WorkoutTemplatesPreview = ({ workoutSummaries, selectedWorkout, handleWorkoutSelection }:
    { workoutSummaries: WorkoutSummary[];
      selectedWorkout: any;
      handleWorkoutSelection: (workoutId: string) => void;
    }
) => {
  return (
    <>
        {workoutSummaries.map((summary, idx) => {
            const isSelected = selectedWorkout?.workoutId === `${summary.workoutId}`;
            return (
            <button
                key={idx}
                onClick={() => handleWorkoutSelection(summary.workoutId)}
                className={`w-full text-left p-4 rounded-lg transition-all border-b ${
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
            );
        })}
    </>
  );
}

export default WorkoutTemplatesPreview;