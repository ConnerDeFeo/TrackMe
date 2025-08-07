import { useEffect, useState } from "react";
import { Button, TextInput, View } from "react-native";
import CoachService from "../../../services/CoachService";
import AsyncStorage from "../../../services/AsyncStorage";
import { useNavigation } from "@react-navigation/native";


//Page where coaches can create a new group
const CreateGroup = () => {
    const navigation = useNavigation<any>();
    //State to hold group name and user ID
    const [groupName, setGroupName] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        // Fetch user ID from local storage or authentication context
        const fetchUserId = async () => {
            const id = await AsyncStorage.getData("userId");
            if (id) 
                setUserId(id);
        };
        fetchUserId();
    }, []);

    //handles groups creation and redirection
    const handleCreateGroup = async () => {
        try {
            const resp = await CoachService.createGroup(userId, groupName);
            if(resp.ok)
                navigation.navigate('ViewGroup', { groupName:groupName });
        } catch (error) {
            console.log("Error creating group:", error);
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
                className="mx-auto"
            />
            <Button title="Create Group" onPress={handleCreateGroup} />
        </View>
    );
};

export default CreateGroup;