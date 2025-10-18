import { RefObject } from "react";
import { Text, TextInput, View } from "react-native";

const TimeInputDisplay = ({handleMinutesChange, handleSecondsChange, currSeconds, required, ref, handleFocus, handleBlur, hidden}
    :{
        handleMinutesChange: (text: string) => void, 
        handleSecondsChange: (text: string) => void, 
        currSeconds: number, 
        required?: boolean,
        ref?: RefObject<TextInput | null>,
        handleFocus?: () => void,
        handleBlur?: () => void,
        hidden?: boolean,
    }
)=>{
    return(
        <View className={hidden ? 'hidden' : ''}>
            <Text className="text-xs font-medium text-gray-600 mb-1 text-center">
                Rest Time (MM:SS)
            </Text>
            <View className="flex-row items-center gap-x-2 justify-center">
                {/* Minutes input */}
                <TextInput
                    className={`border rounded-md p-3 bg-white text-black text-center w-20 ${currSeconds === 0 && required ? 'border-red-500' : 'trackme-border-gray'}`}
                    placeholder="Mins"
                    keyboardType="numeric"
                    onChangeText={handleMinutesChange}
                    maxLength={2}
                    value={Math.floor(currSeconds / 60) === 0 ? '' : Math.floor(currSeconds / 60).toString()}
                    ref={ref}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <Text className="font-bold text-lg">:</Text>
                {/* Seconds input */}
                <TextInput
                    className={`border rounded-md p-3 bg-white text-black text-center w-20 ${currSeconds === 0 && required ? 'border-red-500' : 'trackme-border-gray'}`}
                    placeholder="Secs"
                    keyboardType="numeric"
                    onChangeText={handleSecondsChange}
                    maxLength={2}
                    value={currSeconds % 60 === 0 ? '' : (currSeconds % 60).toString()}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </View>
        </View>
    );
}

export default TimeInputDisplay;