import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import HistoryService from "../services/HistoryService";
import { Input } from "../common/types/inputs/Input";
import InputDisplay from "../common/components/display/input/InputDisplay";
import TrackMeButton from "../common/components/display/TrackMeButton";
import UserService from "../services/UserService";
import { AccountType } from "../common/constants/Enums";
import CollapsibleUserDisplay from "../common/components/display/CollapsibleUserDisplay";

const HistoricalData = ()=>{
    const route = useRoute();
    const { date } = (route.params as { date: string }) || {};
    const [historicalData, setHistoricalData] = useState<Record<string, {inputs:Input[], username:string, firstName:string, lastName:string}>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
    const navigation = useNavigation<any>();
    const [accountType, setAccountType] = useState<string>("");

    useEffect(() => {
        const fetchAccountType = async () => {
            const accountType = await UserService.getAccountType();
            setAccountType(accountType);
        };
        fetchAccountType();
    }, []);

    // Fetch historical data for the given date when component mounts
    useFocusEffect(useCallback(() => {
        const fetchHistoricalData = async () => {
            setLoading(true);
            const resp = await HistoryService.fetchHistoricalData(date);
            if (resp.ok) {
                const data = await resp.json();
                setHistoricalData(data);
                // Expand all users by default
                setExpandedUsers(new Set(Object.keys(data)));
            }
            setLoading(false);
        };
        fetchHistoricalData();
    }, [date]));

    const toggleUser = (userID: string) => {
        setExpandedUsers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userID)) {
                newSet.delete(userID);
            } else {
                newSet.add(userID);
            }
            return newSet;
        });
    };

    if (loading) {
        return (
            <ActivityIndicator size="large" color="#007AFF" className="m-10"/>
        );
    }
    return(
        <View className="flex-1">
            {Object.keys(historicalData).length > 0 ?
                Object.entries(historicalData).map(([userID, data]) => 
                    <CollapsibleUserDisplay
                        key={userID}
                        username={data.username}
                        firstName={data.firstName}
                        lastName={data.lastName}
                        expanded={expandedUsers.has(userID)}
                        onPress={() => toggleUser(userID)}
                    >
                        {data.inputs.map((input, idx) => (
                            <InputDisplay key={idx} input={input} />
                        ))}
                    </CollapsibleUserDisplay>
                )
                :
                <Text className="text-center text-gray-500 mt-6 pt-2">No historical data for this date.</Text>
            }
            { accountType === AccountType.Athlete &&
                <TrackMeButton text="Update My Inputs" className="m-4" onPress={() => navigation.navigate('HistoricalInputs', {date})} />
            }
        </View>
    );
}

export default HistoricalData;