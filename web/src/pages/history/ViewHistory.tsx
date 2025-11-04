import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputDisplay from "../../common/components/display/input/InputDisplay";
import HistoryService from "../../services/HistoryService";
import type { Input } from "../../common/types/inputs/Input";
import TrackmeButton from "../../common/components/TrackmeButton";

const divHistory = () => {
    const { date } = useParams<{ date: string }>();
    const [historicalData, setHistoricalData] = useState<Record<string, {username:string, inputs: Input[]}>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(()=>{
        const fetchHistoricalData = async () => {
            setLoading(true);
            const resp = await HistoryService.fetchHistoricalData(date!);
            if (resp) {
                const data = await resp.json();
                setHistoricalData(data);
            }else{
                setHistoricalData({});
            }
            setLoading(false);
        };

        fetchHistoricalData();
    },[date])

    if(loading){
        return (
            <div className="max-w-7xl mx-auto p-4">
                <div className="flex justify-center items-center h-64">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <TrackmeButton onClick={()=>navigate('/history')} className="my-4">Back</TrackmeButton>
            {Object.keys(historicalData).length === 0 ? (
                <p className="text-center pt-10">No historical data available for this date.</p>
            ) : 
            (Object.entries(historicalData).map(([athleteId, data]) => (
                <div key={athleteId} className="bg-white border-2 border-gray-200 shadow-md p-5 mb-6">
                    <p className="text-md font-bold mb-2">{data.username}</p>
                    <div className="gap-y-2">
                        {data.inputs.map((input: Input, index: number) => (
                            <InputDisplay key={index} input={input} />
                        ))}
                    </div>
                </div>
            ))
            )}
        </div>
    );
}

export default divHistory;