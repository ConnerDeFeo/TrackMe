import { useEffect, useState } from "react";
import RelationService from "../services/RelationService";
import RelationActionButton from "../common/components/display/RelationActionButton";
import { RelationStatus } from "../common/constants/Enums";
import { ActivityIndicator, Text, View } from "react-native";

const RelationInvites = () => {
    const [invites, setInvites] = useState<string[][]>([]);
    const [loading, setLoading] = useState<boolean>(false);
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
            {loading ? 
                <ActivityIndicator size="large" color="#007AFF" className="m-10"/>
                : invites.length === 0 ?
                <Text className="text-center text-gray-500 mt-10">No pending relation invites.</Text>
                :
                invites.map((user) => (
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