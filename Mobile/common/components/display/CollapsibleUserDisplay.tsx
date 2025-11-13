import { Image, Pressable, View } from "react-native";
import UserDisplay from "./UserDisplay";

const CollapsibleUserDisplay = ({ username, firstName, lastName, expanded, onPress, userProfilePic, children }: 
    { username: string; firstName: string; lastName: string, expanded: boolean, onPress: () => void, userProfilePic?: string, children?: React.ReactNode }) => {
    return(
        <View className="bg-white rounded-xl shadow-md p-4 mb-4" >
          <Pressable className="flex flex-row justify-between" onPress={onPress}>
            <UserDisplay firstName={firstName} lastName={lastName} username={username} userProfilePic={userProfilePic}/>
            <Image source={require('../../../assets/images/Back.png')} className={`h-6 w-6 ${expanded ? 'rotate-[-90deg]' : 'rotate-180'}`}/>
          </Pressable>

          {expanded && (
            <View className="pt-2 mt-2 border-t trackme-border-gray">
              {children}
            </View>
          )}
        </View>
    );
}

export default CollapsibleUserDisplay;