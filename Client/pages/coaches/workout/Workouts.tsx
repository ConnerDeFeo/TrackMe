import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";

const Workouts = () => {
  const navigation = useNavigation<any>();

  

  return (
    <View>
      <Text>Workouts</Text>
      <Button title="Create Workout" onPress={() => navigation.navigate('CreateWorkout')} />
    </View>
  );
};

export default Workouts;
