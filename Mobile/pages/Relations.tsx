import { useCallback, useState } from "react";
import SearchBar from "../common/components/display/SearchBar";
import { Text, View } from "react-native";
import RelationService from "../services/RelationService";
import { RelationStatus } from "../common/constants/Enums";
import TextButton from "../common/components/display/TextButton";
import RelationActionButton from "../common/components/display/RelationActionButton";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import UserDisplay from "../common/components/display/UserDisplay";

// Relations.tsx


const Relations = () => {
    // currentUsers: list of users as arrays [id, name, …, status]
    // searchTerm: current text in the search bar
    // loading: whether we’re waiting on a network response
    const [currentUsers, setCurrentUsers] = useState<string[][]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [pendingProposals, setPendingProposals] = useState<number>(0);

    const navigation = useNavigation<any>();

    // Fetch initial relations once on mount
    useFocusEffect(useCallback(() => {
        const fetchRelations = async () => {
            setLoading(true);
            const resp = await RelationService.searchUserRelation();
            if (resp.ok) {
                const data = await resp.json();
                setCurrentUsers(data);
            } else {
                setCurrentUsers([]);
            }
            setLoading(false);
        };
        const fetchPendingProposals = async () => {
            const resp = await RelationService.getPendingProposals();
            if (resp.ok) {
                const data = await resp.json();
                setPendingProposals(data.count);
            } else {
                setPendingProposals(0);
            }
        };
        fetchPendingProposals();
        fetchRelations();
    }, []));

    // Search by term, update list & loading state
    const handleSearch = async (term: string) => {
        setLoading(true);
        const resp = await RelationService.searchUserRelation(term);
        if (resp.ok) {
            setCurrentUsers(await resp.json());
        } else {
            setCurrentUsers([]);
        }
        setLoading(false);
        setSearchTerm(term);
    };

    // Add a relation then refresh list
    const handleAddRelation = async (relationId: string) => {
        const resp = await RelationService.addRelation(relationId);
        if (resp.ok) {
            setCurrentUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user[0] === relationId) {
                        // Update relation status based on previous status
                        if (user[5] === RelationStatus.NotAdded.toString()) {
                            user[5] = RelationStatus.Pending.toString();
                        } else if (user[5] === RelationStatus.AwaitingResponse.toString()) {
                            user[5] = RelationStatus.Added.toString();
                        }
                    }
                    return user;
                })
            );
        }
    };

    // Remove a relation then refresh list
    const handleRelationRemoval = async (relationId: string) => {
        const resp = await RelationService.removeRelation(relationId);
        if (resp.ok) {
            setCurrentUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user[0] === relationId) {
                        user[5] = RelationStatus.NotAdded.toString();
                    }
                    return user;
                })
            );
        }
    };
    // Main render: SearchBar, loading state, empty state, or list of users
    return (
        <View className="mx-4">
            <View className="flex flex-row justify-between items-center mt-2">
                <TextButton text={`Invites (${pendingProposals})`} onPress={() => navigation.navigate("RelationInvites")}/>
                <TextButton text="Friends" onPress={() => navigation.navigate("Friends")}/>
            </View>
            {/* Search input */}
            <View className="mt-4">
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleSearch={handleSearch}
                    placeholder="Search by username or name..."
                />
            </View>

            {/* Loading indicator */}
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500 text-base">Loading...</Text>
                </View>

            // No users found or no relations yet
            ) : currentUsers.length === 0 ? (
                <View className="flex-1 justify-center items-center px-8">
                    <Text className="text-gray-400 text-base text-center">
                        {searchTerm ? "No users found" : "No relations yet"}
                    </Text>
                </View>

            // List of users with action buttons
            ) : (
                <View className="mt-2">
                    {currentUsers.map(([userId, username, firstName, lastName, accountType, relationStatus]) => (
                        <View
                            key={userId}
                            className="flex flex-row justify-between items-center border trackme-border-gray p-4 rounded-xl mb-3 bg-white shadow-sm"
                        >
                            {/* User name */}
                            <UserDisplay
                                username={username}
                                firstName={firstName}
                                lastName={lastName}
                            />
                            {/* Action button */}
                            <RelationActionButton
                                relationId={userId}
                                relationStatus={relationStatus as RelationStatus}
                                handleAddRelation={handleAddRelation}
                                handleRelationRemoval={handleRelationRemoval}
                            />
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default Relations;