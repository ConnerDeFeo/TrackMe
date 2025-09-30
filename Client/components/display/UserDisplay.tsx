import { Text, View } from "react-native";

// Basic user display for a given coach or athlete
const UserDisplay = ({username, firstName, lastName, className}:{username: string; firstName: string; lastName: string; className?: string}) => {
    const displayName = firstName || lastName ? `${firstName} ${lastName}` : username;
    return (
        <View className={`flex flex-row gap-x-2 items-center ${className}`}>
            <Text className="font-semibold">{displayName}</Text>
            <Text className="text-sm text-gray-500">@{username}</Text>
        </View>
    );
}

export default UserDisplay;