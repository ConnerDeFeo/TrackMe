import { useRoute } from "@react-navigation/native";
import Profile from "../common/components/profile/Profile";

const OtherProfile = () => {
    const route = useRoute();
    const { userId } = route.params as { userId: string };
    return <Profile routedUserId={userId} />;
}

export default OtherProfile;