import DateService from "../../../services/DateService";
import RenderDay from "./RenderDay";

const RenderMonth = ({ 
    monthYear, 
    handleDateSelect, 
    availableDates, 
    loading
}: { 
    monthYear: Date; 
    handleDateSelect: (date: string) => void;
    availableDates?: Set<string>; 
    loading?: boolean;
}) => {
    const today = new Date().toISOString().slice(0,10);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
        <div className="relative">
            {/* Days of week header */}
            <div className="flex mb-2">
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="flex-1 text-center">
                        <span className="font-bold">{day}</span>
                    </div>
                ))}
            </div>
            
            {/* Calendar grid */}
            <div className="flex flex-wrap">
                {DateService.getDaysInMonth(monthYear).map((day, index) => {
                    if (!day) {
                        return <div key={index} className="w-[14.28%] p-1" />;
                    }
                    const dateStr = `${DateService.formatDate(monthYear).slice(0,7)}-${day < 10 ? `0${day}` : day}`;
                    const hasData = availableDates?.has(dateStr) ?? false;
                    const inFuture = dateStr > today;
                    
                    return (
                        <RenderDay
                            key={index}
                            day={day}
                            onPress={() => handleDateSelect(dateStr)}
                            hasHistoricalData={hasData}
                            inFuture={inFuture}
                        />
                    );
                })}
            </div>
            
            {/* Loading overlay */}
            {loading && (
                <div className="absolute h-full w-full bg-white opacity-30 top-0 left-0 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}
        </div>
    );
};

export default RenderMonth;