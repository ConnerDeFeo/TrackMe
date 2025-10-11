import type { Workout } from "../../../types/workouts/Workout";
import DisplaySection from "../workout/DisplaySection";

interface DisplayWorkoutProps {
  workout: Workout;
  onClick?: () => void;
}

const DisplayWorkout: React.FC<DisplayWorkoutProps> = ({ workout, onClick }) => {
    
    return (
        <div
            className={`bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden ${
                onClick ? 'cursor-pointer hover:shadow-lg transition-all' : ''
            }`}
            onClick={onClick}
        >
            {/* Workout header with title and optional description */}
            <div className="trackme-bg-blue text-white p-6">
                <h2 className="text-2xl font-bold mb-2">{workout.title}</h2>
                {workout.description && (
                    <p className="text-blue-100 text-sm">{workout.description}</p>
                )}
            </div>

            {/* Workout sections or fallback message */}
            <div className="p-6 space-y-4">
                {workout.sections && workout.sections.length > 0 ? (
                    workout.sections.map((section, idx) => <DisplaySection section={section} index={idx} key={idx} />)
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No sections in this workout</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisplayWorkout;