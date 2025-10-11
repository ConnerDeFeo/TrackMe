import type { Exercise } from "../../../types/workouts/Exercise";
import type { Section } from "../../../types/workouts/Section";
import DisplayExercise from "./DisplayExercise";

const DisplaySection = ({ section, }: { section: Section})=>{
    // Format sets display (e.g., "3-5 sets" or "3 sets")
    const formatSets = (minSets: number, maxSets?: number) => {
        if (maxSets && maxSets !== minSets) {
            return `${minSets}-${maxSets} sets`;
        }
        return `${minSets} ${minSets === 1 ? 'set' : 'sets'}`;
    };

    return (
        <div
            className="bg-white rounded-xl border-2 border-gray-200 p-4 space-y-3"
        >
            {/* Section header with name and sets */}
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900">{section.name}</h3>
                <span className="text-sm font-medium trackme-blue bg-blue-50 px-3 py-1 rounded-full">
                    {formatSets(section.minSets, section.maxSets)}
                </span>
            </div>

            {/* List of exercises within this section */}
            <div className="space-y-2">
                {section.exercises &&
                    section.exercises.map((exercise: Exercise, idx: number) =>
                        <DisplayExercise exercise={exercise} index={idx} key={idx}/>
                    )}
            </div>
        </div>
    );
}

export default DisplaySection;