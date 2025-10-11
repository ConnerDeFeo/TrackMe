import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DisplayWorkout from "../../common/components/display/workout/DisplayWorkout";
import type { Workout } from "../../common/types/workouts/Workout";
import InputDisplay from "../../common/components/display/input/InputDisplay";
import HistoryService from "../../services/HistoryService";

const divHistory = () => {
    const { date } = useParams<{ date: string }>();
    const [historicalData, setHistoricalData] = useState<Record<string, any>>({});

    useEffect(()=>{
        const fetchHistoricalData = async () => {
            const resp = await HistoryService.fetchHistoricalData(date!);
            if (resp) {
                const data = await resp.json();
                setHistoricalData(data);
            }else{
                setHistoricalData({});
            }
        };

        fetchHistoricalData();
    },[date])

    return (
        <div className="max-w-7xl mx-auto p-4">
            {Object.keys(historicalData).length === 0 ? (
                <p className="text-center pt-10">No historical data available for this date.</p>
            ) : 
            (Object.keys(historicalData).map((groupId) => (
                <div key={groupId} className="bg-white border-2 border-gray-200 shadow-md p-5 mb-6">
                    <p className="text-3xl font-bold text-gray-900 mb-4">{historicalData[groupId].name}</p>
                    
                    <div className="mb-4 gap-y-4">
                        <p className="text-lg font-semibold mb-3">Workouts</p>
                        {historicalData[groupId].workouts.map((workout: Workout, idx: number) =>
                            <DisplayWorkout
                                workout={workout}
                                key={idx}
                            />
                        )}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-lg font-semibold mb-3">Athlete Inputs</p>
                        {Object.keys(historicalData[groupId].athleteInputs).map((athleteId) => {
                        const athleteData = historicalData[groupId].athleteInputs[athleteId];
                        return (
                            <div key={athleteId} className="mb-4">
                                <p className="text-md font-bold mb-2">{athleteData.username}</p>
                                <div className="gap-y-2">
                                    {athleteData.inputs.map((input: Record<string, any>, index: number) => (
                                        <InputDisplay key={index} input={input} />
                                    ))}
                                </div>
                            </div>
                        );
                        })}
                    </div>
                </div>
            ))
            )}
        </div>
    );
}

export default divHistory;