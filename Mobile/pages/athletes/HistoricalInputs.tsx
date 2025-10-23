import { useRoute } from "@react-navigation/native";
import Inputs from "../../common/components/athletes/inputs/Inputs";

const HistoricalInputs = ()=>{
    const route = useRoute();
    const { date } = route.params as { date: string };

    return(
        <Inputs
            date={date}
        />
    );
}

export default HistoricalInputs;