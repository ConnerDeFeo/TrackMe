import { ExerciseType } from "../../constants/Enums";
import { Variables } from "../../constants/Variables";
import type { Exercise } from "../../types/workouts/Exercise";

const DisplayExercise = ({ exercise, index }: { exercise: Exercise; index: number }) => {
    const formatReps = (min?: number, max?: number) => {
        if(min === 1 && (!max || max === 1)){
            return "";
        }
        return max && max !== min ? `${min}-${max} x ` : `${min || ''} x `;
    };

    const formatRest = (sec?: number) => (
        `${sec ? sec / 60 : ''}m ${sec ? `${sec % 60}s` : ''}`
    );

    const getContent = () => {
        if (exercise.type === ExerciseType.Run) 
            return `${formatReps(exercise.minReps, exercise.maxReps)} ${exercise.distance} ${exercise.measurement} `;
        if (exercise.type === ExerciseType.Rest) 
            return `Rest: ${formatRest(exercise.minReps)}`;
        return `${formatReps(exercise.minReps, exercise.maxReps)} ${exercise.description}`;
    };

    return (
        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-xl">{Variables.Icons[exercise.type as keyof typeof Variables.Icons] || '•'}</span>
            <span className="text-sm text-gray-700">{getContent()}</span>
        </div>
    );
}

export default DisplayExercise;