import { View } from "react-native";
import Groups from "../../components/groups/Groups";
import { useNavigation } from "@react-navigation/native";

//Athlete view when they are looking at all ther groups
const AthleteGroups = () => {
  const navigation = useNavigation<any>();

  return (
    <View className="mt-10 w-[85%] mx-auto">
      <Groups/>
    </View>
  );
};

export default AthleteGroups;