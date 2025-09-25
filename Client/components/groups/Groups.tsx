import GeneralService from "../../services/GeneralService";
import { useEffect, useState } from "react";
import GroupDisplay from "./GroupDisplay";
import { useNav } from "../../hooks/useNav";
import UserService from "../../services/UserService";

//View of all groups displayed in a list
const Groups = () => {
  const [groups, setGroups] = useState<string[][]>([]);
  const {navigate} = useNav();

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
    const accountType = await UserService.getAccountType();
    
    if(accountType==='Athlete'){
      navigate("ViewGroupAthlete", { groupName, groupId });
    }
    else{
      navigate("ViewGroupCoach", { groupName, groupId });
    }
  };

  return (
    <>
      {groups.map((group, index) => (
        <GroupDisplay key={index} groupName={group[0]} navigateTo={() => handleNavigation(group[0], group[1])} />
      ))}
    </>
  );
};

export default Groups;