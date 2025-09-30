import { Text, Pressable, View } from "react-native";
import GeneralService from "../services/GeneralService";

// Component that renders individual coach-athlete relationships on display pages
// Shows user name and provides removal functionality
const CoachAthleteRelationship:React.FC<{ user: string[]; fetchUsers: () => void; }> = ({ user, fetchUsers }) => {

    // Handles removing the coach-athlete relationship
    const handleRemoval = async (targetId: string) => {
        // Call API to remove the relationship
        const resp = await GeneralService.removeCoachAthlete(targetId);
        
        // Refresh the user list if removal was successful
        if (resp.ok) {
            fetchUsers();
        }
    };

    return (
        <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-row justify-between items-center">
            {/* Display user name (user[1] contains the name) */}
            <Text className="text-lg font-medium">{user[1]}</Text>
            
            {/* Remove button - uses user[0] as the ID */}
            <Pressable
                onPress={() => handleRemoval(user[0])}
            >
                <Text className="trackme-red">Remove</Text>
            </Pressable>
        </View>
    );
}
export default CoachAthleteRelationship;