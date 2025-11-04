const RenderDay = ({ 
    day, 
    onPress, 
    hasHistoricalData, 
    inFuture 
}: { 
    day: number | null; 
    onPress?: () => void; 
    hasHistoricalData: boolean; 
    inFuture?: boolean;
}) => {
    return (
        <button
            className={`w-[14.28%] aspect-square border border-gray-200 rounded-full flex items-center justify-center 
                transition-all hover:opacity-70 active:scale-95
                ${hasHistoricalData ? "bg-blue-500 text-white" : inFuture ? "bg-gray-200" : "bg-white"}`}
            onClick={!inFuture ? onPress : undefined}
            disabled={inFuture}
        >
            {day && <span className="my-auto">{day}</span>}
        </button>
    );
};

export default RenderDay;
