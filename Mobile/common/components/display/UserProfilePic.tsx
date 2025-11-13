import { ActivityIndicator, Image } from "react-native";

const UserProfilePic = ({ imageUri, height, width, loading }: { imageUri?: string, height?: number, width?: number; loading?: boolean }) => {
    return ( loading ?
        <ActivityIndicator size="large" color="#007AFF" className="m-10"/>
        :
        <Image
            source={imageUri ? { uri: imageUri } : require("../../../assets/images/DefaultProfilePic.png")}
            style={{ height: height || 48, width: width || 48, borderRadius: (height || 48) / 2 }}
        />
    );
};

export default UserProfilePic;