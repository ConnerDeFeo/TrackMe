import { ExerciseType } from "../constants/Enums";
import type { Exercise } from "../types/workouts/Exercise";
import type { Section } from "../types/workouts/Section";
import type { Workout } from "../types/workouts/Workout";

interface DisplayWorkoutProps {
  workout: Workout;
  onPress?: () => void;
}

const DisplayWorkout: React.FC<DisplayWorkoutProps> = ({ workout, onPress }) => {
  const renderExercise = (exercise: Exercise, index: number) => {
    const getExerciseIcon = (type: string) => {
      switch (type) {
        case 'run':
          return '🏃';
        case 'rest':
          return '⏱️';
        case 'strength':
          return '💪';
        default:
          return '•';
      }
    };

    const formatReps = (minReps?: number, maxReps?: number) => {
      if (maxReps && maxReps !== minReps) {
        return `${minReps}-${maxReps}`;
      }
      return minReps ? `${minReps}` : '';
    };

    return (
      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
        <span className="text-2xl">{getExerciseIcon(exercise.type)}</span>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase trackme-blue">
              {exercise.type}
            </span>
          </div>
          
          {exercise.type === ExerciseType.Run && (
            <div className="mt-1">
              <p className="text-sm font-medium text-gray-900">
                {exercise.distance} {exercise.measurement}
              </p>
              <p className="text-xs text-gray-600">
                Reps: {formatReps(exercise.minReps, exercise.maxReps)}
              </p>
            </div>
          )}

          {exercise.type === ExerciseType.Rest && (
            <div className="mt-1">
              <p className="text-sm font-medium text-gray-900">
                Rest Period
              </p>
              <p className="text-xs text-gray-600">
                {formatReps(exercise.minReps, exercise.maxReps)} seconds
              </p>
            </div>
          )}

          {exercise.type === ExerciseType.Strength && (
            <div className="mt-1">
              <p className="text-sm font-medium text-gray-900">
                {exercise.description}
              </p>
              <p className="text-xs text-gray-600">
                Reps: {formatReps(exercise.minReps, exercise.maxReps)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSection = (section: Section, index: number) => {
    const formatSets = (minSets: number, maxSets?: number) => {
      if (maxSets && maxSets !== minSets) {
        return `${minSets}-${maxSets} sets`;
      }
      return `${minSets} ${minSets === 1 ? 'set' : 'sets'}`;
    };

    return (
      <div key={index} className="bg-white rounded-xl border-2 border-gray-200 p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900">{section.name}</h3>
          <span className="text-sm font-medium trackme-blue bg-blue-50 px-3 py-1 rounded-full">
            {formatSets(section.minSets, section.maxSets)}
          </span>
        </div>
        
        <div className="space-y-2">
          {section.exercises && section.exercises.map((exercise, idx) => renderExercise(exercise, idx))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden ${
        onPress ? 'cursor-pointer hover:shadow-lg transition-all' : ''
      }`}
      onClick={onPress}
    >
      {/* Header */}
      <div className="trackme-bg-blue text-white p-6">
        <h2 className="text-2xl font-bold mb-2">{workout.title}</h2>
        {workout.description && (
          <p className="text-blue-100 text-sm">{workout.description}</p>
        )}
      </div>

      {/* Sections */}
      <div className="p-6 space-y-4">
        {workout.sections && workout.sections.length > 0 ? (
          workout.sections.map((section, idx) => renderSection(section, idx))
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