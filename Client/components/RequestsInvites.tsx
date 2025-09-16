import { Text, TouchableOpacity, View } from "react-native";

const RequestsInvites = ({ proposals, handleAcceptance, handleDecline}: { proposals: string[], handleAcceptance: (id: string) => void, handleDecline: (id: string) => void}) => {
    return (
        <>
            {/* Requests list or empty state */}
            <View className="gap-y-4">
                {proposals.length > 0 ? (
                    // Render each athlete request with accept/decline buttons
                    proposals.map(proposal => (
                    <View key={proposal[0]} className="bg-white rounded-lg p-4 mx-auto w-[90%] border border-gray-300">
                        <View className="flex-row items-center justify-between">
                            {/* Display athlete name */}
                            <Text className="text-xl font-medium flex-1">{proposal[1]}</Text>
                            <View className="flex-row gap-x-2">
                                <TouchableOpacity
                                    className="bg-black rounded-lg py-2 px-3"
                                    onPress={() => handleAcceptance(proposal[0])}
                                >
                                    <Text className="text-white font-semibold text-center">Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    className="bg-red-500 rounded-lg py-2 px-3"
                                    onPress={() => handleDecline(proposal[0])}
                                >
                                    <Text className="text-white font-semibold text-center">Decline</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    ))
                ) : (
                    // Show message when no pending proposals exist
                    <View className="bg-white rounded-lg shadow-sm p-6">
                    <Text className="text-gray-500 text-center">No pending proposals</Text>
                    </View>
                )}
            </View>
        </>
    );
};
export default RequestsInvites;