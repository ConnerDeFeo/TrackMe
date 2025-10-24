import { Pressable, ScrollView, Text, View } from "react-native";

const AvailiableInputs = ({isOpen, onClose, options, setSelected}: 
    {isOpen: boolean, onClose: () => void, options: any[], setSelected: (value: string) => void}) => {
    return (isOpen && (
            <ScrollView 
                contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}
                className="absolute bottom-12 max-h-80 border bg-white w-full rounded-lg trackme-border-gray"
                keyboardShouldPersistTaps="handled"
            >
                <View className="p-2 w-full">
                    {options.map((option, index) => (
                        <Pressable 
                            key={index} 
                            className="py-2 border-b trackme-border-gray" 
                            onPress={() => {
                                setSelected(option);
                                onClose();
                            }}
                        >
                            <Text className="text-gray-800 text-center">{option}</Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        )
    );
}

export default AvailiableInputs;