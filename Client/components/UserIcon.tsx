import { Text, View } from "react-native";

//Icon in the top right of the screen
const UserIcon = ()=> {
  return (
    <View className="rounded-full bg-black w-[3rem] h-[3rem] ml-auto mr-7 mt-[4.5rem]">
      <Text className="text-white m-auto">PFP</Text>
    </View>
  );
}

export default UserIcon;