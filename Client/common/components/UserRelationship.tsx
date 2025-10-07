import { Text, Pressable, View } from "react-native";
import UserDisplay from "./display/UserDisplay";
import RelationService from "../../services/RelationService";

// Component that renders individual coach-athlete relationships on display pages
// Shows user name and provides removal functionality
const UserRelationship:React.FC<{ user: Record<string, any>; fetchUsers: () => void; }> = ({ user, fetchUsers }) => {
    console.log(user)
    // Handles removing the coach-athlete relationship
    const handleRemoval = async (targetId: string) => {
        // Call API to remove the relationship
        const resp = await RelationService.removeRelation(targetId);
        
        // Refresh the user list if removal was successful
        if (resp.ok) {
            fetchUsers();
        }
    };

    return (
        <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-row justify-between items-center">
            {/* Display user name (user[1] contains the name) */}
            <UserDisplay username={user.username} firstName={user.firstName} lastName={user.lastName} />
            
            {/* Remove button - uses user[0] as the ID */}
            <Pressable
                onPress={() => handleRemoval(user.relationId)}
            >
                <Text className="trackme-red">Remove</Text>
            </Pressable>
        </View>
    );
}
export default UserRelationship;