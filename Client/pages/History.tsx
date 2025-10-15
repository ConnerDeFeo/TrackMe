import { useEffect, useState } from "react";
import HistoryService from "../services/HistoryService";
import NavigationContainer from "../common/components/display/NavigationContainer";
import SearchDate from "../common/components/SearchDate";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const History = () => {
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const navigation = useNavigation<any>();

    const fetchAvailableDates = async (date?:string) => {
            const resp = await HistoryService.getAvailableHistoryDates(date);
            if(resp.ok) {
                const data = await resp.json();
                setAvailableDates(data);
            } else {
                setAvailableDates([]);
            }
        }

    useEffect(() => {
        fetchAvailableDates();  
    },[]);

    return(
        <View className="my-4">
            <SearchDate handleDateSearch={fetchAvailableDates} handleClear={()=>fetchAvailableDates()}/>
            {availableDates && availableDates.length > 0 ? availableDates.map((date) => (
                <NavigationContainer key={date} text={date} navigateTo={()=>navigation.navigate("HistoricalData", { date })}/>
            )) : 
                <View className="p-6">
                    <Text>No historical data available</Text>
                </View>
            }
        </View>
    );
}

export default History;