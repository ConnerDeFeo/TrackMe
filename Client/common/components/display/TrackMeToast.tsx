import { Text, View } from "react-native";

const TrackMeToast = ({props}: {props: any}) => {
    return (
        <View className="bg-green-600 px-5 py-4 rounded-lg w-[90%]">
            <Text className="text-white font-bold text-base">
                {props.text1}
            </Text>
            {props.text2 && (
                <Text className="text-white text-sm">
            {props.text2}
                </Text>
            )}
        </View>
    );
}

export default TrackMeToast;