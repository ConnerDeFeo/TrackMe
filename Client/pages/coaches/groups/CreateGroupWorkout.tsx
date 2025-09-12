import { useNavigation, useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";
import WorkoutCreation from "../../../components/coaches/workouts/WorkoutCreation";

const CreateGroupWorkout = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { groupId } = route.params as { groupId: string};
    return (
        <></>
    );
}

export default CreateGroupWorkout;