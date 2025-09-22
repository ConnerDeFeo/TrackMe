import { useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";

const MassInput = () => {
  const route = useRoute();
  const { groupId, groupName } = route.params as { groupId: string; groupName: string };

  return (

    <View className="mt-4 px-4">
      <Text className="font-semibold text-xl">{groupName}</Text>

    </View>
  );
}

export default MassInput;