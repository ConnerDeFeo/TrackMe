import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryService from "../../services/HistoryService";
import Calender from "../../common/components/history/Calender";

const History = () => {
    // Current distance filter text input
    const [distanceInput, setDistanceInput] = useState<string>("");
    // Distance filters for available dates
    const [distanceFilters, setDistanceFilters] = useState<string[]>([]);


    return(
        <div className="grid max-w-3xl mx-auto">
            <Calender distanceFilters={distanceFilters} />
        </div>
    );
}

export default History;