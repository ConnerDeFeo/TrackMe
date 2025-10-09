import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryService from "../../services/HistoryService";
import NavigationContainer from "../../common/components/display/NavigationContainer";
import SearchDate from "../../common/components/SearchDate";

const History = () => {
    // Local state to hold the list of dates for which history exists
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const navigate = useNavigate();

    // Fetch all dates that have workouts assigned when the component mounts
    const fetchAvailableHistoryDates = async () => {
        const resp = await HistoryService.getAvailableHistoryDates();
        if (resp.ok) {
            const historyData = await resp.json();       // Parse response JSON
            setAvailableDates(historyData);              // Update state with fetched dates
        }
    };

    // Run once on component mount
    useEffect(() => {
        fetchAvailableHistoryDates();
    }, []);

    // Handler called when user searches for a specific date
    const handleDateSearch = async (dateInput: string) => {
        const resp = await HistoryService.getAvailableHistoryDates(dateInput);
        if (resp.ok) {
            const historyData = await resp.json();
            console.log("Filtered dates:", historyData);    // Debug log
            setAvailableDates(historyData);              // Filter state by search result
        }
    };

    return(
        <div className="grid max-w-3xl mx-auto">
            <SearchDate
                handleDateSearch={handleDateSearch}
                handleClear={fetchAvailableHistoryDates}
            />
            {availableDates.map((date) => (
                <NavigationContainer
                    key={date}
                    navigateTo={() => navigate(`view/${date}`)}
                    text={date}
                />
            ))}
        </div>
    );
}

export default History;