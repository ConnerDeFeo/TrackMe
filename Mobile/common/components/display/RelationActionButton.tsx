import { View } from "react-native";
import { RelationStatus } from "../../constants/Enums";
import TrackMeButton from "./TrackMeButton";

const RelationActionButton = ({ relationStatus, relationId, handleAddRelation, handleRelationRemoval }:
    {
        relationStatus: RelationStatus,
        relationId: string,
        handleAddRelation: (id: string) => void,
        handleRelationRemoval: (id: string) => void
    })=>{
    const width = 100;
    switch (relationStatus) {
        case RelationStatus.NotAdded:
            // Show "Add" button
            return (
                <TrackMeButton
                    text="Add"
                    onPress={() => handleAddRelation(relationId)}
                    width={width}
                />
            );
        case RelationStatus.Pending:
            // Show "Pending…" button (disabled-looking)
            return (
                <TrackMeButton
                    text="Pending..."
                    onPress={() => handleRelationRemoval(relationId)}
                    gray
                    width={width}
                />
            );
        case RelationStatus.AwaitingResponse:
            // Show "Accept" and "Decline" side by side
            return (
                <View className="flex flex-row justify-between items-center gap-2">
                    <TrackMeButton
                        text="Accept"
                        onPress={() => handleAddRelation(relationId)}
                        width={width}
                    />
                    <TrackMeButton
                        text="Decline"
                        red
                        onPress={() => handleRelationRemoval(relationId)}
                        width={width}
                    />
                </View>
            );
        case RelationStatus.Added:
            // Show "Remove" button
            return (
                <TrackMeButton
                    text="Remove"
                    onPress={() => handleRelationRemoval(relationId)}
                    red
                    width={width}
                />
            );
        default:
            return null;
    }
}

export default RelationActionButton;