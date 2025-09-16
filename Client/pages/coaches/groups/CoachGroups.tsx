import Groups from "../../../components/groups/Groups";
import { useNavigation } from "@react-navigation/native";
import PageHeading from "../../../components/PageHeading";

//Page where coaches can see and manage their groups
const CoachGroups = () => {
  const navigation = useNavigation<any>();

  return (
    <>
      <PageHeading title="Groups" addFunction={() => navigation.navigate('CreateGroup')} />
      <Groups />
    </>
  );
}

export default CoachGroups;