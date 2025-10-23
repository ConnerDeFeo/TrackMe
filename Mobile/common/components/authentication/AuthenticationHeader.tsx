import { Image, Text, View } from "react-native";

//Header at the top of signin and login screens
const AuthenticationHeader = () => {
    return (
        <View className="flex flex-row items-center justify-center absolute top-20 left-0 right-0">
            <Image source={require('../../../assets/images/Track.png')} className="h-[3.5rem] w-[3.5rem]"/>
            <Text className="ml-3 font-bold text-4xl">TrackMe</Text>
        </View>
    );
};

export default AuthenticationHeader;