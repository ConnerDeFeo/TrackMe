import { Text, View } from "react-native";

const RenderInputsForGroup: React.FC<{ groupId: string; workoutInputs: any[] }> = ({ groupId, workoutInputs }) => {
    const groupInputs = workoutInputs.filter(input => input.groupId === groupId);

    return (
        <View>
            {groupInputs.map(input => (
                <Text key={input.id}>{input.name}</Text>
            ))}
        </View>
    );
};

export default RenderInputsForGroup;
