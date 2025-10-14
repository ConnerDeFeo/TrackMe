import { useNavigation, useRoute } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import CoachGroupService from "../../../services/CoachGroupService";
import { useState } from "react";
import Modal from "../../../common/components/Modal";

const GroupSettings = () => {
    const route = useRoute();
    const { groupId } = route.params as { groupId: string };
    const navigation = useNavigation<any>();
    const [deletionMode, setDeletionMode] = useState<boolean>(false);

    /**
     * Deletes the entire group on the server,
     * then resets navigation to the Groups list.
     */
    const handleGroupDeletion = async () => {
        const resp = await CoachGroupService.deleteGroup(groupId);
        if (resp.ok) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Groups' }],
            }); 
        }
    };
    return (
        <View className="flex-1 justify-center items-center px-4 my-4">
            <Pressable
                onPress={() => setDeletionMode(true)}
                className="trackme-bg-red rounded-lg py-3 px-4 mt-2 w-full"
            >
                <Text className="text-white font-semibold text-center">
                    Delete Group
                </Text>
            </Pressable>
            <Modal isOpen={deletionMode} onClose={() => setDeletionMode(false)}>
                <View className="bg-white rounded-lg p-6 w-full ">
                    <Text className="text-lg font-semibold mb-4">Confirm Deletion</Text>
                    <Text className="mb-6">Are you sure you want to delete this group? This action cannot be undone.</Text>
                    <View className="flex-row justify-end space-x-4">
                        <Pressable
                            onPress={() => setDeletionMode(false)}
                            className="bg-gray-300 rounded-lg py-2 px-4"
                        >
                            <Text>Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleGroupDeletion}
                            className="bg-red-600 rounded-lg py-2 px-4"
                        >
                            <Text className="text-white">Delete</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default GroupSettings;