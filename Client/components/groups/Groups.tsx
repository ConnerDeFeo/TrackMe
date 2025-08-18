import { Text, View } from "react-native";
import GeneralService from "../../services/GeneralService";
import { useEffect, useState } from "react";
import GroupDisplay from "./GroupDisplay";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "../../services/AsyncStorage";

//View of all groups displayed in a list
const Groups = () => {
  const [groups, setGroups] = useState<string[][]>([]);
  const navigation = useNavigation<any>();

  //Fetch groups from the server
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const resp = await GeneralService.getGroups();
        if(resp.ok){
          const data = await resp.json();
          setGroups(data);
        }
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };
    fetchGroups();
  }, []);

  const handleNavigation = async (groupName: string, groupId: string) => {
    const accountType = await AsyncStorage.getData('accountType');
    
    if(accountType=='Athlete')
      navigation.navigate("ViewGroupAthlete", { groupName: groupName, groupId: groupId });
    else
      navigation.navigate("ViewGroupCoach", { groupName: groupName, groupId: groupId });
  };

  return (
    <View className="mt-10 w-full mx-auto">
      {groups.map((group, index) => (
        <GroupDisplay key={index} groupName={group[0]} navigateTo={() => handleNavigation(group[0], group[1])} />
      ))}
    </View>
  );
};

export default Groups;