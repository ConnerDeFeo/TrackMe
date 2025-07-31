import { Text, View } from "react-native";

const HomePage = () => {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-3xl">Welcome to the Home Page!</Text>
            <Text className="text-lg">This is where you can manage your account and view your data.</Text>
        </View>
    );
}

export default HomePage;