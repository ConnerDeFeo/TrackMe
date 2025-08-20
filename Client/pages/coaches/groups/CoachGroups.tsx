import { Image, Text, TouchableOpacity, View } from "react-native";
import Groups from "../../../components/groups/Groups";
import { useNavigation } from "@react-navigation/native";

//Page where coaches can see and manage their groups
const CoachGroups = () => {
  const navigation = useNavigation<any>();

  return (
    <View className="mt-[4rem]">
      <View className="flex-row justify-between items-center p-4 mb-2">
        <Text className="text-4xl font-bold">Groups</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')}>
          <Image source={require("../../../images/Add.png")} className="h-12 w-12 rounded-full border-3" />
        </TouchableOpacity>
      </View>

      <Groups />
    </View>
  );
}

export default CoachGroups;