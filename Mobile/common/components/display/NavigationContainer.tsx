import { Pressable, Text, View } from "react-native";
import ArrowButton from "../ArrowButton";

const NavigationContainer = ({navigateTo, text}: {navigateTo: () => void, text: string}) => {
    return(
        <Pressable 
            onPress={navigateTo}
        >
            <View className="bg-white my-1 p-4 rounded-lg shadow-sm border-b-2 trackme-border-gray flex-row items-center justify-between">
                <Text className="text-gray-800 text-xl font-bold">
                    {text}
                </Text>
                <ArrowButton onPress={navigateTo}/>
            </View>
        </Pressable>
    );
}

export default NavigationContainer;