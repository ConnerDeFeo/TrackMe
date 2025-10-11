import { useNavigate, useParams } from "react-router-dom";
import TrackmeButton from "../common/components/TrackmeButton";
import GroupHeader from "../common/components/groups/GroupHeader";
import CoachGroupService from "../services/CoachGroupService";

const GroupSettings = () => {
    const { groupId, groupName } = useParams<{ groupId: string; groupName: string}>();
    const navigate = useNavigate();

    const handleGroupDeletion = async () => {
        const resp = await CoachGroupService.deleteGroup(groupId!);
        if (resp.ok) {
            navigate('/groups');
        } 
    }

    return (
        <div className="max-w-5xl mx-auto">
            <GroupHeader groupName={groupName || "Group Settings"} groupId={groupId || ""}/>
            <TrackmeButton red className="ml-auto block mt-6 mr-6" onClick={handleGroupDeletion}>
                Delete Group "{groupName}"
            </TrackmeButton>
        </div>
    );
}

export default GroupSettings;