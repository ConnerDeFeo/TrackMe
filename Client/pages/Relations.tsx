import { useEffect, useState } from "react";
import SearchBar from "../components/display/SearchBar";
import { Pressable, Text, View } from "react-native";
import RelationService from "../services/RelationService";
import { RelationStatus } from "../common/constants/Enums";

// Relations.tsx


const Relations = () => {
    // currentUsers: list of users as arrays [id, name, …, status]
    // searchTerm: current text in the search bar
    // loading: whether we’re waiting on a network response
    const [currentUsers, setCurrentUsers] = useState<string[][]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch initial relations once on mount
    useEffect(() => {
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
        fetchRelations();
    }, []);

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
            handleSearch(searchTerm);
        }
    };

    // Remove a relation then refresh list
    const handleRelationRemoval = async (relationId: string) => {
        const resp = await RelationService.removeRelation(relationId);
        if (resp.ok) {
            handleSearch(searchTerm);
        }
    };

    // Render action button based on the user's relation status
    const renderActionButton = (relationId: string, relationStatus: RelationStatus) => {
        switch (relationStatus) {
            case RelationStatus.NotAdded:
                // Show "Add" button
                return (
                    <Pressable
                        className="px-6 py-2.5 rounded-full trackme-bg-blue"
                        onPress={() => handleAddRelation(relationId)}
                    >
                        <Text className="text-white font-bold text-sm">Add</Text>
                    </Pressable>
                );
            case RelationStatus.Pending:
                // Show "Pending…" button (disabled-looking)
                return (
                    <Pressable
                        className="px-6 py-2.5 rounded-full shadow-sm"
                        onPress={() => handleRelationRemoval(relationId)}
                    >
                        <Text className="text-gray-500 font-bold text-sm">Pending...</Text>
                    </Pressable>
                );
            case RelationStatus.AwaitingResponse:
                // Show "Accept" and "Decline" side by side
                return (
                    <View className="flex flex-row justify-between items-center gap-2">
                        <Pressable
                            className="px-6 py-2.5 rounded-full trackme-bg-blue"
                            onPress={() => handleAddRelation(relationId)}
                        >
                            <Text className="text-white font-bold text-sm text-center">Accept</Text>
                        </Pressable>
                        <Pressable
                            className="px-6 py-2.5 rounded-full trackme-bg-red"
                            onPress={() => handleRelationRemoval(relationId)}
                        >
                            <Text className="text-white font-semibold text-sm text-center">Decline</Text>
                        </Pressable>
                    </View>
                );
            case RelationStatus.Added:
                // Show "Remove" button
                return (
                    <Pressable
                        className="px-6 py-2.5 rounded-full trackme-bg-red shadow-sm"
                        onPress={() => handleRelationRemoval(relationId)}
                    >
                        <Text className="text-white font-bold text-sm">Remove</Text>
                    </Pressable>
                );
            default:
                return null;
        }
    };

    // Main render: SearchBar, loading state, empty state, or list of users
    return (
        <View className="flex-1">
            {/* Search input */}
            <View className="mx-4 mt-4">
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
                <View className="mx-4 mt-4">
                    {currentUsers.map((user) => (
                        <View
                            key={user[0]}
                            className="flex flex-row justify-between items-center border trackme-border-gray p-4 rounded-xl mb-3 bg-white shadow-sm"
                        >
                            {/* User name */}
                            <Text className="font-semibold">{user[1]}</Text>
                            {/* Action button */}
                            {renderActionButton(user[0], user[5] as RelationStatus)}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default Relations;