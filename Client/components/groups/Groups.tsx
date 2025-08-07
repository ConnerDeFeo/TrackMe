import { Text, View } from "react-native";
import GeneralService from "../../services/GeneralService";
import { useEffect, useState } from "react";

//View of all groups displayed in a list
const Groups = () => {
  const [groups, setGroups] = useState<string[][]>([]);

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

  return (
    <View className="mt-10 w-[85%] mx-auto">
      {groups.map((group, index) => (
        <View key={index} className="mx-auto text-2xl flex-row justify-between w-full border">
          <Text>{group[0]}</Text>
        </View>
      ))}
    </View>
  );
};

export default Groups;