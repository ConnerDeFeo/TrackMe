import { useNavigation } from "@react-navigation/native";
import { Button, Text, TextInput, View } from "react-native";
import UserService from "../../services/UserService";
import AsyncStorage from "../../services/AsyncStorage";
import { useEffect, useState } from "react";
import GeneralService from "../../services/GeneralService";

//Profile coaches see when they click on their icon
const CoachProfile = () => {
  const navigation = useNavigation<any>();
  const [userData, setUserData] = useState<Record<string, any>>([]);

  useEffect(()=>{
    const fetchUserData = async () => {
      const userId = await UserService.getUserId();
      if(userId) {
        const resp = await GeneralService.getUser(userId);
        if(resp){
          const data = await resp.json();
          console.log("data?", data)
          setUserData(data);
        }
      }
    };
    fetchUserData();
  },[])

  const handleLogout = async () => {
    await UserService.signOut();
    AsyncStorage.clear();
    navigation.navigate("SignIn");
  }
  
  return (
    <View className="mt-[4rem]">
      <TextInput
        className="border border-gray-300 p-2 rounded"
        placeholder="Update your bio"
        value={userData.bio}
        onChangeText={(text) => setUserData({ ...userData, bio: text })}
      />
      <TextInput
        className="border border-gray-300 p-2 rounded"
        placeholder="Update your first name"
        value={userData.firstName}
        onChangeText={(text) => setUserData({ ...userData, firstName: text })}
      />
      <TextInput
        className="border border-gray-300 p-2 rounded"
        placeholder="Update your last name"
        value={userData.lastName}
        onChangeText={(text) => setUserData({ ...userData, lastName: text })}
      />
      <Button title="Logout" onPress={handleLogout} color={'#E63946'}/>
    </View>
  );
};

export default CoachProfile;