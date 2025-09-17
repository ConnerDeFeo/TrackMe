import { Text, View } from "react-native";
import Groups from "../../components/groups/Groups";
import PageHeading from "../../components/PageHeading";

//Athlete view when they are looking at all ther groups
const AthleteGroups = () => {
  return (
    <>
      <PageHeading title="Groups" />
      <Groups/>
    </>
  );
};

export default AthleteGroups;