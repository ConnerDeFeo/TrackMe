import { Pressable, Text, View } from "react-native";
import UserProfilePic from "./UserProfilePic";
import { useNavigation } from "@react-navigation/native";

// Basic user display for a given coach or athlete
const UserDisplay = ({userId, username, firstName, lastName, userProfilePic, className}:
    {userId: string; username: string; firstName: string; lastName: string; userProfilePic?: string; className?: string}) => {
    const displayName = firstName || lastName ? `${firstName} ${lastName}` : username;
    const maxLength = 30;
    const shotrenedDisplayName = (displayName.length + username.length) > maxLength ? displayName.slice(0, 15) + '...' : displayName;
    const navigation = useNavigation<any>();
    return (
        <Pressable className={`flex flex-row gap-x-2 items-center ${className}`} onPress={()=>navigation.navigate('OtherProfile', { userId: userId })}>
            <UserProfilePic imageUri={userProfilePic} height={32} width={32}/>
            <Text className="font-semibold">{shotrenedDisplayName}</Text>
            <Text className="text-sm text-gray-500">@{username}</Text>
        </Pressable>
    );
}

export default UserDisplay;