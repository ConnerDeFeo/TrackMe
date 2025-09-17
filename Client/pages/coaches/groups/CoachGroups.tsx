import Groups from "../../../components/groups/Groups";
import PageHeading from "../../../components/PageHeading";
import { useNav } from "../../../hooks/useNav";

//Page where coaches can see and manage their groups
const CoachGroups = () => {
  const { navigate } = useNav();

  return (
    <>
      <PageHeading title="Groups" addFunction={() => navigate('CreateGroup')} />
      <Groups />
    </>
  );
}

export default CoachGroups;