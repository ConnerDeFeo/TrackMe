import { useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";

const ViewGroupAthlete = ()=>{
    const route = useRoute();
    const { groupName, groupId } = route.params as { groupName: string, groupId: string } || {};

    return(
        <View>
            <Text>Group Name: {groupName}</Text>
            <Text>Group ID: {groupId}</Text>
        </View>
    );
}

export default ViewGroupAthlete;