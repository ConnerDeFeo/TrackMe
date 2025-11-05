import { Text, TextInput, View } from "react-native";

const ProfileInformation = ({ isEditing, data, title, handleFieldChange, dataEmpty, className }:
    { isEditing: boolean, data: string, title: string, handleFieldChange: (value: string) => void, dataEmpty: string, className?: string }
) => {
    return(
        <View className={className}>
            <Text className="text-gray-700 font-semibold mb-2">{title}</Text>
            {isEditing ?
                <TextInput
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
                    value={data || ''}
                    onChangeText={(text) => handleFieldChange(text)}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
                :
                <Text className="font-semibold ml-4 my-4">
                    {data || dataEmpty}
                </Text>
            }
        </View>
    );
}

export default ProfileInformation;