import { Text, TouchableOpacity, View } from "react-native";

/**
 * Renders a list of proposals (requests or invites) with accept and decline actions.
 * This component can be used for a coach to see requests from athletes,
 * or for an athlete to see invites from a coach.
 *
 * @param {object} props - The component props.
 * @param {string[]} props.proposals - An array of proposals, where each proposal is expected to be an array-like object (e.g., [id, name]).
 * @param {(id: string) => void} props.handleAcceptance - Callback function to execute when a proposal is accepted.
 * @param {(id: string) => void} props.handleDecline - Callback function to execute when a proposal is declined.
 */
const RequestsInvites = ({ proposals, handleAcceptance, handleDecline}: { proposals: string[], handleAcceptance: (id: string) => void, handleDecline: (id: string) => void}) => {
    return (
        <>
            {/* Container for the list of proposals or the empty state message. */}
            <View className="gap-y-4">
                {proposals.length > 0 ? (
                    // If there are proposals, map over them and render each one.
                    proposals.map(proposal => (
                    <View key={proposal[0]} className="bg-white rounded-lg p-4 mx-auto w-[90%] border border-gray-300">
                        <View className="flex-row items-center justify-between">
                            {/* Display the name from the proposal. Assumes name is the second element. */}
                            <Text className="text-xl font-medium flex-1">{proposal[1]}</Text>
                            {/* Action buttons container */}
                            <View className="flex-row gap-x-2">
                                {/* Accept button */}
                                <TouchableOpacity
                                    className="bg-black rounded-lg py-2 px-3"
                                    onPress={() => handleAcceptance(proposal[0])}
                                >
                                    <Text className="text-white font-semibold text-center">Accept</Text>
                                </TouchableOpacity>
                                {/* Decline button */}
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
                    // If there are no proposals, display a message indicating the empty state.
                    <View className="bg-white rounded-lg shadow-sm p-6">
                    <Text className="text-gray-500 text-center">No pending proposals</Text>
                    </View>
                )}
            </View>
        </>
    );
};
export default RequestsInvites;