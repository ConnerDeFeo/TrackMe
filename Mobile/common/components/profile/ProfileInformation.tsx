// import { Text, TextInput, TextInput, View } from "react-native";

// const ProfileInformation = () => {
//     return(
//         <View className="flex-1">
//             <Text className="text-gray-700 font-semibold mb-2">Bio</Text>
//             {isEditing ?
//                 <TextInput
//                     className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
//                     placeholder="Tell us about yourself..."
//                     value={userData.bio || ''}
//                     onChangeText={(text) => handleFieldChange('bio', text)}
//                     multiline
//                     numberOfLines={4}
//                     textAlignVertical="top"
//                 />
//                 :
//                 <Text className="font-semibold ml-4 my-4">
//                     {userData.bio || 'No bio provided.'}
//                 </Text>
//             }
//         </View>
//     );
// }

// export default ProfileInformation;