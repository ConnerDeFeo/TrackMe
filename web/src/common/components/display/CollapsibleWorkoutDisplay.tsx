import { useState } from "react";
import type { Workout } from "../../types/workouts/Workout";
import DisplaySection from "./DisplaySection";
import TrackmeButton from "../TrackmeButton";

interface CollapsibleWorkoutDisplayProps {
    workout: Workout;
    onClick?: () => void;
    onClickText?: string;
}

const CollapsibleWorkoutDisplay: React.FC<CollapsibleWorkoutDisplayProps> = ({ workout, onClick, onClickText }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!workout.title) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden mb-3">
            {/* Collapsible Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full trackme-bg-blue text-white p-6 flex items-center justify-between hover:opacity-90 transition-opacity"
            >
                <h2 className="text-2xl font-bold text-left">{workout.title}</h2>
                <span className="text-2xl ml-4 flex-shrink-0">
                    <img 
                        alt="Toggle Icon" 
                        src="/assets/images/VectorDown.png"  
                        className={`${isExpanded ? '' : 'transform rotate-[-90deg]'} transition-transform duration-300 h-10 w-10`} 
                    />
                </span>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-6">
                    {/* Description */}
                    <div className="py-2 mb-4 border-b border-gray-200 flex flex-wrap justify-between items-center">
                        {workout.description && (
                            <p className="text-gray-600 text-sm max-w-[80%] break-words">
                                {workout.description}
                            </p>
                        )}
                        <TrackmeButton onClick={onClick} className="ml-auto mt-2 flex-shrink-0">
                            {onClickText}
                        </TrackmeButton>
                    </div>

                    {/* Sections */}
                    <div className="space-y-4">
                        {workout.sections && workout.sections.length > 0 ? (
                            workout.sections.map((section, idx) => (
                                <DisplaySection section={section} index={idx} key={idx} />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No sections in this workout</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollapsibleWorkoutDisplay;
