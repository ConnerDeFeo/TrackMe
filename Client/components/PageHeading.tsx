import { useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";

const PageHeading = ({ title, goBack, addFunction }: { title: string, goBack?: boolean, addFunction?: () => void }) => {
    const navigation = useNavigation<any>();
    return (
        <View className="relative border-b border-gray-300 px-4 mt-[4rem] pb-2">   
            {goBack && (
                <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4 border">
                    <Text>TEstin</Text>{/* <Image source={require("../images/Back.png")} className="h-8 w-8" /> */}
                </TouchableOpacity>
            )}
            <Text className="text-2xl text-center font-bold">{title}</Text>
            {addFunction && (
                <TouchableOpacity onPress={addFunction} className="absolute right-4 border-2 rounded">
                    <Image source={require("../images/Plus.png")} className="h-5 w-5 m-1" />
                </TouchableOpacity>
            )}
        </View>
    );
};
export default PageHeading;