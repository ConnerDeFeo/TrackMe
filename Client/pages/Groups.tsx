import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../common/context/AuthContext";
import GeneralService from "../services/GeneralService";
import { AccountType } from "../common/constants/Enums";
import NavigationContainer from "../common/components/display/NavigationContainer";


//View of all groups displayed in a list
const Groups = () => {
  const [groups, setGroups] = useState<string[][]>([]);
  const navigation = useNavigation<any>();
  const context = useContext(AuthContext);
  const accountType = context[0];

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
    if(accountType===AccountType.Athlete){
      navigation.navigate("ViewGroupAthlete", { groupName, groupId });
    }
    else{
      navigation.navigate("ViewGroupCoach", { groupName, groupId });
    }
  };

  return (
    <>
      {groups.map((group, index) => (
        <NavigationContainer key={index} text={group[0]} navigateTo={() => handleNavigation(group[0], group[1])} />
      ))}
    </>
  );
};

export default Groups;