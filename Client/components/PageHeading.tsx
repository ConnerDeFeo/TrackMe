import { useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";

const PageHeading = ({ title, addFunction, goBack }: { title: string, addFunction?: () => void, goBack?: boolean}) => {
    const navigation = useNavigation<any>();

    return (
        <View className="relative flex flex-row justify-between border-b border-gray-300 px-4 mt-[4rem] min-h-[2rem] pb-2 mb-4">  
            <View>
                {goBack && (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require("../images/Back.png")} className="h-8 w-8"/>
                    </TouchableOpacity>
                )}
            </View>
            <View className="absolute left-0 right-0">
                <Text className="text-2xl font-bold self-center ">{title}</Text>
            </View>
            <View>
                {addFunction && (
                    <TouchableOpacity onPress={addFunction} className="right-4">
                        <Image source={require("../images/Plus.png")} className="h-5 w-5 m-1" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
export default PageHeading;