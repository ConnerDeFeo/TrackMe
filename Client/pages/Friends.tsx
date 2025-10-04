import { useEffect, useState } from "react";
import RelationService from "../services/RelationService";
import { Text, View } from "react-native";
import RelationActionButton from "../components/display/RelationActionButton";
import { RelationStatus } from "../common/constants/Enums";
import UserDisplay from "../components/display/UserDisplay";

const Friends = ()=>{
    const [friends, setFriends] = useState<Record<string,string>[]>([]);

    useEffect(()=>{
        const fetchFriends = async ()=>{
            const resp = await RelationService.getMutualUserRelationships();
            if(resp.ok){
                const data = await resp.json();
                console.log(data);
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
        <View className="mt-2 mx-4">
            {friends.map((friend) => (
                <View
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
                </View>
            ))}
        </View>
    );
}

export default Friends;