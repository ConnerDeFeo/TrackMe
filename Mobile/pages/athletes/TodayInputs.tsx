import DateService from "../../services/DateService";
import Inputs from "../../common/components/athletes/inputs/Inputs";

//Page where athletes input times
const TodayInputs = ()=>{
    // Current date for the given inputs
    return(
        <Inputs
            date={DateService.formatDate(new Date())}
            workoutGroupButton
        />
    );
}

export default TodayInputs;