import { Pressable, Text, View } from "react-native";
import { RelationStatus } from "../../common/constants/Enums";
import TextButton from "./TextButton";

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
                <TextButton
                    text="Add"
                    onPress={() => handleAddRelation(relationId)}
                />
            );
        case RelationStatus.Pending:
            // Show "Pending…" button (disabled-looking)
            return (
                <TextButton
                    text="Pending..."
                    onPress={() => handleRelationRemoval(relationId)}
                />
            );
        case RelationStatus.AwaitingResponse:
            // Show "Accept" and "Decline" side by side
            return (
                <View className="flex flex-row justify-between items-center gap-2">
                    <TextButton
                        text="Accept"
                        onPress={() => handleAddRelation(relationId)}
                    />
                    <TextButton
                        text="Decline"
                        red
                        onPress={() => handleRelationRemoval(relationId)}
                    />
                </View>
            );
        case RelationStatus.Added:
            // Show "Remove" button
            return (
                <TextButton
                    text="Remove"
                    onPress={() => handleRelationRemoval(relationId)}
                    red
                />
            );
        default:
            return null;
    }
}

export default RelationActionButton;