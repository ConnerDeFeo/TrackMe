import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateService from "../../../services/DateService";
import HistoryService from "../../../services/HistoryService";
import RenderMonth from "./RenderMonth";

const Calender = ({distanceFilters}:{distanceFilters?: string[]}) => {
    // Today's date, flag for not allowing user to go past today
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    // Current month and year being viewed
    const [months, setMonths] = useState<Date[]>([thisMonth]);
    const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0);
    const currentMonthKey = months[currentMonthIndex].toISOString().slice(0,7);
    
    // Earliest date with historical data available (YYYY-MM format)
    const [earliestDate, setEarliestDate] = useState<string>(thisMonth.toISOString().slice(0,7));
    
    // Display name for current month (e.g., "January 2024")
    const displayMonthName = months[currentMonthIndex].toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Cached available dates with historical data, keyed by month (YYYY-MM)
    const [availableDates, setAvailableDates] = useState<Record<string, Set<string>>>({});
    // Loading state for available dates fetch
    const [loading, setLoading] = useState<boolean>(false);
    
    const navigate = useNavigate();


    const appendMonth = () => {
        setMonths(prev => [ ...prev, DateService.addMonths(prev[prev.length -1], -1)]);
    }

    // Fetch available dates for a specific month from the server
    const fetchAvailableDates = async () => {
        setLoading(true);
        const resp = await HistoryService.getAvailableHistoryDates(currentMonthKey, distanceFilters);
        if(resp.ok) {
            const data = await resp.json();
            setAvailableDates({...availableDates, [currentMonthKey]: new Set(data)});
        } else {
            setAvailableDates({...availableDates, [currentMonthKey]: new Set()});
        }
        setLoading(false);
    }

    // On screen focus, fetch available dates
    useEffect(() => {
        if (availableDates.hasOwnProperty(currentMonthKey)) return;
        fetchAvailableDates();
    }, [currentMonthKey]);

    useEffect(() => {
        fetchAvailableDates();
    }, [distanceFilters]);
    
    // Fetch the earliest date with available data on component mount
    useEffect(() => {
        const fetchEarliestDate = async () => {
            const resp = await HistoryService.getEarliestDateAvailable();
            if (resp.ok) {
                const earliestDate = await resp.json();
                setEarliestDate(earliestDate);
            }
        };
        fetchEarliestDate();
    }, []);


    // Navigate to detailed view for selected date
    const handleDateSelect = useCallback((date: string) => {
        navigate(`/history/view/${date}`);
    }, []);

    const goToPreviousMonth = () => {
        appendMonth();
        setTimeout(() => {
            setCurrentMonthIndex(prev => prev + 1);
        }, 50);
    };

    const goToNextMonth = () => {
        if (currentMonthIndex > 0) {
            setCurrentMonthIndex(prev => prev - 1);
        }
    };

    return (
        <>
            {/* Month header with navigation arrows */}
            <div className="flex justify-between items-center m-4 relative py-4">
                {/* Previous month button (only show if not at earliest date) */}
                {earliestDate < months[currentMonthIndex].toISOString().slice(0,7) && (
                    <button 
                        className="p-1 pr-3 absolute left-0 hover:opacity-70 transition-opacity"
                        onClick={goToPreviousMonth}
                    >
                        <img src="/assets/images/Back.png" alt="Previous" className="w-12 h-12" />
                    </button>
                )}
                
                {/* Current month display */}
                <h2 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    {displayMonthName}
                </h2>
                
                {/* Next month button (only show if not at current month) */}
                {currentMonthIndex > 0 && (
                    <button 
                        className="p-1 pl-3 absolute right-0 hover:opacity-70 transition-opacity"
                        onClick={goToNextMonth}
                    >
                        <img src="/assets/images/Back.png" alt="Next" className="w-12 h-12 rotate-180" />
                    </button>
                )}
            </div>

            {/* Calendar container */}
            <div className="mx-4 relative">
                <RenderMonth
                    monthYear={months[currentMonthIndex]}
                    availableDates={availableDates[currentMonthKey]}
                    handleDateSelect={handleDateSelect}
                    loading={loading}
                />
            </div>
        </>
    );
}
export default Calender;