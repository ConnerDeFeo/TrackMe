import { Text, View } from "react-native";

const GroupDisplay: React.FC<{ groupName:string, coachUsername:string }> = ({ groupName, coachUsername }) => {
    return (
        <View>
            <Text>{groupName}</Text>
            <Text>{coachUsername}</Text>
        </View>
    );
};
