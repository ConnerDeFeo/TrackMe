import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "../services/AsyncStorage";

//Icon in the top right of the screen
const UserIcon = ()=> {
  const navigation = useNavigation<any>();
  const [accountType, setAccountType] = useState<string>("");

  useEffect(() => {
    const fetchAccountType = async () => {
      const type = await AsyncStorage.getData("accountType");
      if (type) setAccountType(type);
    };
    fetchAccountType();
  }, []);

  return (
    <View className="rounded-full bg-black w-[3rem] h-[3rem] ml-auto mr-7 mt-[4.5rem]">
      <TouchableOpacity onPress={() => navigation.navigate(`${accountType}Profile`)}>
        <Text className="text-white m-auto">PFP</Text>
      </TouchableOpacity>
    </View>
  );
}

export default UserIcon;