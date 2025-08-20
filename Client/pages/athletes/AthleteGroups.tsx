import { Text, View } from "react-native";
import Groups from "../../components/groups/Groups";

//Athlete view when they are looking at all ther groups
const AthleteGroups = () => {
  return (
    <View className="mt-[4rem] w-[85%] mx-auto">
      <Text className="text-4xl font-bold mb-2">Groups</Text>
      <Groups/>
    </View>
  );
};

export default AthleteGroups;