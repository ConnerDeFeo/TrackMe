import { useEffect, useState } from "react";
import RelationService from "../services/RelationService";
import { ActivityIndicator, Text, View } from "react-native";
import RelationActionButton from "../common/components/display/RelationActionButton";
import { RelationStatus } from "../common/constants/Enums";
import UserDisplay from "../common/components/display/UserDisplay";

const Friends = ()=>{
    const [friends, setFriends] = useState<Record<string,string>[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{
        const fetchFriends = async ()=>{
            setLoading(true);
            const resp = await RelationService.getMutualUserRelationships();
            if(resp.ok){
                const data = await resp.json();
                setFriends(data);
            } else {
                setFriends([]);
            }
            setLoading(false);
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
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" className="m-10"/>
            ) : friends.length === 0 ? (
                <Text className="text-center text-gray-500 mt-10">No friends yet.</Text>
            ) : friends.map((friend) => (
                <View
                    key={friend.relationId}
                    className="flex flex-row justify-between items-center border trackme-border-gray p-4 rounded-xl mb-3 bg-white shadow-sm"
                >
                    {/* User name */}
                    <UserDisplay userId={friend.relationId} username={friend.username} firstName={friend.firstName} lastName={friend.lastName} userProfilePic={friend.profilePicUrl} />
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