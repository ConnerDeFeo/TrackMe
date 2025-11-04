import { useState } from "react";
import Calender from "../../common/components/history/Calender";
import TrackmeButton from "../../common/components/TrackmeButton";

const History = () => {
    // Current distance filter text input
    const [distanceInput, setDistanceInput] = useState<string>("");
    // Distance filters for available dates
    const [distanceFilters, setDistanceFilters] = useState<string[]>([]);

    return(
        <div className="max-w-3xl mx-auto pt-4 pb-6">
            <div className="mx-4 my-6 border-b trackme-border-gray pb-4">
                <h3 className="text-lg font-semibold mb-3">Search Distances</h3>
                <div className="flex gap-2 mb-3 items-center">
                    <input 
                        type="number"
                        placeholder="Enter distance (meters)" 
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={distanceInput}
                        onChange={(e) => setDistanceInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && distanceInput.trim() && !distanceFilters.includes(distanceInput.trim())) {
                                setDistanceFilters([...distanceFilters, distanceInput.trim()]);
                                setDistanceInput("");
                            }
                        }}
                    />
                    <TrackmeButton 
                        onClick={() => {
                            if (distanceInput.trim() && !distanceFilters.includes(distanceInput.trim())) {
                                setDistanceFilters([...distanceFilters, distanceInput.trim()]);
                                setDistanceInput("");
                            }
                        }}
                    >
                        Add
                    </TrackmeButton>
                </div>
                
                {distanceFilters.length > 0 && (
                    <div className="mb-2 mx-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">
                                Active Filters ({distanceFilters.length})
                            </span>
                            <button 
                                onClick={() => setDistanceFilters([])}
                                className="text-red-600 font-medium py-2 pr-2 pl-4 hover:opacity-70 transition-opacity"
                            >
                                Clear All
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {distanceFilters.map((filter, index) => (
                                <button
                                    key={index} 
                                    className="flex items-center bg-blue-100 rounded-full px-4 py-2 shadow-sm gap-x-2 hover:bg-blue-200 transition-colors"
                                    onClick={() => setDistanceFilters(prev => prev.filter(dst => dst !== filter))}
                                >
                                    <span className="text-blue-800 font-medium mr-2">{filter}m</span>
                                    <span className="text-red-600 font-bold">×</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Calender distanceFilters={distanceFilters} />
        </div>
    );
}

export default History;