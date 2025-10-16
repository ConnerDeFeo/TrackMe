import { useRef } from "react";
import usePersistentState from "../../common/hooks/usePersistentState";
import { useNavigation } from "@react-navigation/native";
import { Input } from "../../common/types/inputs/Input";
import { useWorkoutGroup } from "../../common/hooks/useWorkoutGroup";
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from "react-native";
import QuickInput from "../../common/components/QuickInput";
import InputsScrollableSection from "../../common/components/athletes/inputs/InputsScrollableSection";

//Page where athletes input times
const Inputs = ()=>{
    // Track current input values for each given group { groupId : [time/distance, time/distance] }
    const [currentInputs, setCurrentInputs] = usePersistentState<Input[]>('current', []);
    const { workoutGroup } = useWorkoutGroup();
    // Store previously submitted workout inputs organized by date and group
    const scrollRef = useRef<ScrollView | null>(null);
    const navigation = useNavigation<any>();


    const handleInputSubmission = async (input:Input) => {
        setCurrentInputs(prev => [...prev, input]);
        scrollRef.current?.scrollToEnd({animated: true});
    }

    return (
        <KeyboardAvoidingView 
            className="flex-1 bg-white"
            behavior="padding"
            keyboardVerticalOffset={100}
        >
            {/* Submitted Entries Section - Scrollable */}
            <InputsScrollableSection 
                scrollRef={scrollRef} 
                currentInputs={currentInputs} 
                setCurrentInputs={setCurrentInputs} 
            />

            {/* Input Tracking Section - Fixed at Bottom */}
            <View className="border-t border-gray-200 px-6 py-4">
                <View className="flex flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold text-gray-800">
                        New Entry
                    </Text>
                    <Pressable onPress={() => navigation.navigate('CreateWorkoutGroup')} className="bg-blue-50 rounded-full inline p-2">
                        <Text className="trackme-blue text-sm">Workout Group</Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('MassInput')} className="bg-blue-50 rounded-full inline p-2">
                        <Text className="trackme-blue text-sm">Mass Input</Text>
                    </Pressable>
                </View>
                {/* Display current workout partners if any */}
                {workoutGroup.length > 0 && (
                    <View className="bg-gray-100 p-4 rounded-lg mb-4">
                        <Text className="text-sm font-medium text-gray-600 mb-2">
                            Workout Partners
                        </Text>
                        <View className="flex flex-row flex-wrap gap-2">
                            {workoutGroup.map((member, idx) => (
                                <View
                                    key={idx}
                                    className="bg-white border border-gray-200 rounded-full px-3 py-1"
                                >
                                    <Text className="text-sm font-medium text-gray-700">
                                        {member.username}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
                <QuickInput 
                    handleInputAddition={handleInputSubmission} 
                    onFocus={() => scrollRef.current?.scrollToEnd({animated: true})}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

export default Inputs;