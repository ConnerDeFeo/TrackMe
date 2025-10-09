import { useEffect, useState } from "react";
import RelationService from "../services/RelationService";
import RelationActionButton from "../common/components/display/RelationActionButton";
import { RelationStatus } from "../common/constants/Enums";
import UserDisplay from "../common/components/display/UserDisplay";

const Friends = ()=>{
    const [friends, setFriends] = useState<Record<string,string>[]>([]);

    useEffect(()=>{
        const fetchFriends = async ()=>{
            const resp = await RelationService.getMutualUserRelationships();
            if(resp.ok){
                const data = await resp.json();
                setFriends(data);
            } else {
                setFriends([]);
            }
        };
        fetchFriends();
    }, []);

    const handleRemoveFriend = async (relationId: string) => {
        const resp = await RelationService.removeRelation(relationId);
        if(resp.ok){
            setFriends((prevFriends) => prevFriends.filter(friend => friend[0] !== relationId));
        }
    };

    return(
        <div className="pt-4 max-w-5xl mx-auto">
            {friends.map((friend) => (
                <div
                    key={friend.relationId}
                    className="flex flex-row justify-between items-center border trackme-border-gray p-4 rounded-xl mb-3 bg-white shadow-sm"
                >
                    {/* User name */}
                    <UserDisplay username={friend.username} firstName={friend.firstName} lastName={friend.lastName} />
                    {/* Action button */}
                    <RelationActionButton
                        relationId={friend.relationId}
                        relationStatus={RelationStatus.Added}
                        handleAddRelation={()=>{}}
                        handleRelationRemoval={handleRemoveFriend}
                    />
                </div>
            ))}
        </div>
    );
}

export default Friends;
