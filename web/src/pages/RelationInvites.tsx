import { useEffect, useState } from "react";
import RelationService from "../services/RelationService";
import RelationActionButton from "../common/components/display/RelationActionButton";
import { RelationStatus } from "../common/constants/Enums";
import UserDisplay from "../common/components/display/UserDisplay";

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

    console.log(invites);
    return(
        <div className="mt-2 mx-4 max-w-5xl mx-auto">
            {invites.map(([id, username, firstName, lastName, AccountType]) => (
                <div
                    key={id}
                    className="flex flex-row justify-between items-center border trackme-border-gray p-4 rounded-xl mb-3 bg-white shadow-sm"
                >
                    {/* User name */}
                    <UserDisplay username={username} firstName={firstName} lastName={lastName} />
                    {/* Action button */}
                    <RelationActionButton
                        relationId={id}
                        relationStatus={RelationStatus.AwaitingResponse}
                        handleAddRelation={handleAcceptInvite}
                        handleRelationRemoval={handleDeclineInvite}
                    />
                </div>
            ))}
        </div>
    );
}

export default RelationInvites;