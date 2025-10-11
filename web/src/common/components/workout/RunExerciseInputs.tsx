import type { RunExercise } from "../../types/workouts/RunExercise";
import React from "react";

interface RunExerciseInputsProps {
    exercise: RunExercise;
    partIdx: number;
    handleExerciseChange: (
        index: number,
        field: keyof RunExercise,
        value: string | number | undefined
    ) => void;
    handleRepsChange: (
        index: number,
        field: 'minReps' | 'maxReps',
        value: string
    ) => void;
}

const RunExerciseInputs: React.FC<RunExerciseInputsProps> = ({
    exercise,
    partIdx,
    handleExerciseChange,
    handleRepsChange,
}) => {
    // Update the distance field
    const onDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleExerciseChange(partIdx, 'distance', e.target.value);
    };

    // Update the minimum reps
    const onMinRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleRepsChange(partIdx, 'minReps', e.target.value);
    };

    // Update the maximum reps
    const onMaxRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleRepsChange(partIdx, 'maxReps', e.target.value);
    };

    return (
        <div className="flex items-center space-x-2">
            {/* Distance input */}
            <input
                type="number"
                value={exercise.distance ?? ''}
                onChange={onDistanceChange}
                placeholder="Distance"
                className="w-28 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
            />
            <span className="text-xs text-gray-500">meters</span>
            <span className="text-gray-300">|</span>

            {/* Reps range */}
            <span className="text-xs text-gray-600 font-medium">Reps:</span>

            <input
                type="number"
                value={exercise.minReps ?? ''}
                onChange={onMinRepsChange}
                placeholder="Min"
                className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
            />
            <span className="text-gray-400">-</span>
            <input
                type="number"
                value={exercise.maxReps ?? ''}
                onChange={onMaxRepsChange}
                placeholder="Max"
                className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
            />
        </div>
    );
};

export default RunExerciseInputs;