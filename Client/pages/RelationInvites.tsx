import { useEffect, useState } from "react";
import RelationService from "../services/RelationService";
import RelationActionButton from "../components/display/RelationActionButton";
import { RelationStatus } from "../common/constants/Enums";
import { Text, View } from "react-native";

const RelationInvites = () => {
    const [invites, setInvites] = useState<string[][]>([]);
    const fetchInvites = async () => {
        const resp = await RelationService.getRelationInvites();
        if (resp.ok) {
            const data = await resp.json();
            setInvites(data);
        } else {
            setInvites([]);
        }
    };

    useEffect(() => {
        fetchInvites();
    }, []);

    const handleAcceptInvite = async (relationId: string) => {
        const resp = await RelationService.addRelation(relationId);
        if (resp.ok) {
            fetchInvites();
        }
    };

    const handleDeclineInvite = async (relationId: string) => {
        const resp = await RelationService.removeRelation(relationId);
        if (resp.ok) {
            fetchInvites();
        }
    };

    return(
        <View className="mt-2 mx-4">
            {invites.map((user) => (
                <View
                    key={user[0]}
                    className="flex flex-row justify-between items-center border trackme-border-gray p-4 rounded-xl mb-3 bg-white shadow-sm"
                >
                    {/* User name */}
                    <Text className="font-semibold">{user[1]}</Text>
                    {/* Action button */}
                    <RelationActionButton
                        relationId={user[0]}
                        relationStatus={RelationStatus.AwaitingResponse}
                        handleAddRelation={handleAcceptInvite}
                        handleRelationRemoval={handleDeclineInvite}
                    />
                </View>
            ))}
        </View>
    );
}

export default RelationInvites;