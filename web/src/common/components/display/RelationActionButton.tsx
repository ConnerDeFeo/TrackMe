import { RelationStatus } from "../../constants/Enums";
import TrackmeButton from "../TrackmeButton";

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
                <TrackmeButton onClick={() => handleAddRelation(relationId)}>Add</TrackmeButton>
            );
        case RelationStatus.Pending:
            // Show "Pending…" button (disabled-looking)
            return (
                <TrackmeButton onClick={() => handleRelationRemoval(relationId)} gray>Pending...</TrackmeButton>
            );
        case RelationStatus.AwaitingResponse:
            // Show "Accept" and "Decline" side by side
            return (
                <div className="flex flex-row justify-between items-center gap-2">
                    <TrackmeButton onClick={() => handleAddRelation(relationId)}>Accept</TrackmeButton>
                    <TrackmeButton red onClick={() => handleRelationRemoval(relationId)}>Decline</TrackmeButton>
                </div>
            );
        case RelationStatus.Added:
            // Show "Remove" button
            return (
                <TrackmeButton onClick={() => handleRelationRemoval(relationId)} red>Remove</TrackmeButton>
            );
        default:
            return null;
    }
}

export default RelationActionButton;