import { Pressable, Text, View } from "react-native";
import { RelationStatus } from "../../common/constants/Enums";

const RelationActionButton = ({ relationStatus, relationId, handleAddRelation, handleRelationRemoval }:
    {
        relationStatus: RelationStatus,
        relationId: string,
        handleAddRelation: (id: string) => void,
        handleRelationRemoval: (id: string) => void
    })=>{
    switch (relationStatus) {
        case RelationStatus.NotAdded:
            // Show "Add" button
            return (
                <Pressable
                    className="px-6 py-2.5 rounded-full trackme-bg-blue"
                    onPress={() => handleAddRelation(relationId)}
                >
                    <Text className="text-white font-bold text-sm">Add</Text>
                </Pressable>
            );
        case RelationStatus.Pending:
            // Show "Pending…" button (disabled-looking)
            return (
                <Pressable
                    className="px-6 py-2.5 rounded-full shadow-sm"
                    onPress={() => handleRelationRemoval(relationId)}
                >
                    <Text className="text-gray-500 font-bold text-sm">Pending...</Text>
                </Pressable>
            );
        case RelationStatus.AwaitingResponse:
            // Show "Accept" and "Decline" side by side
            return (
                <View className="flex flex-row justify-between items-center gap-2">
                    <Pressable
                        className="px-6 py-2.5 rounded-full trackme-bg-blue"
                        onPress={() => handleAddRelation(relationId)}
                    >
                        <Text className="text-white font-bold text-sm text-center">Accept</Text>
                    </Pressable>
                    <Pressable
                        className="px-6 py-2.5 rounded-full trackme-bg-red"
                        onPress={() => handleRelationRemoval(relationId)}
                    >
                        <Text className="text-white font-semibold text-sm text-center">Decline</Text>
                    </Pressable>
                </View>
            );
        case RelationStatus.Added:
            // Show "Remove" button
            return (
                <Pressable
                    className="px-6 py-2.5 rounded-full trackme-bg-red shadow-sm"
                    onPress={() => handleRelationRemoval(relationId)}
                >
                    <Text className="text-white font-bold text-sm">Remove</Text>
                </Pressable>
            );
        default:
            return null;
    }
}

export default RelationActionButton;