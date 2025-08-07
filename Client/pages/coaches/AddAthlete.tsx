import React, { useEffect, useState } from 'react';
import { View,  FlatList, Text, Button} from 'react-native';
import CoachService from '../../services/CoachService';
import { useRoute } from '@react-navigation/core';
import SearchBar from '../../components/SearchBar';
import { getCurrentUser } from 'aws-amplify/auth';

//Page for adding athletes to a coaches group
const AddAthlete= () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [results, setResults] = useState<string[][]>([]);
    const [loading, setLoading] = useState(false);

    // Function to handle search input and fetch results
    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        setLoading(true);
        const user = await getCurrentUser();
        const res = await CoachService.searchAthletes(searchTerm, user.userId);
        if(res.ok){
            const athletes:string[][] = await res.json();
            setResults(athletes);
        }
        setLoading(false);
    };

    //Invite athlete to group
    const handleInvite = async (athleteId: string) => {
        const user = await getCurrentUser();
        console.log(user.userId)
        const resp = await CoachService.inviteAthlete(athleteId, user.userId);
        if(resp.ok){
            handleSearch(searchTerm); // Re-fetch athletes to update the list
        }
    }

    //Initial fetch of random athletes
    useEffect(() => {
        // Initial fetch to load all athletes when the component mounts
        const fetchAllAthletes = async () => {
            setLoading(true);
            const user = await getCurrentUser();
            const res = await CoachService.searchAthletes('', user.userId);
            if(res.ok){
                const athletes:string[][] = await res.json();
                setResults(athletes);
            }
            setLoading(false);
        };
        fetchAllAthletes();
    }, []);

    //Renders each athlete in the list
    const renderAthlete = ({ item }: { item: string[] }) => {
        const username = item[0];
        const userId = item[1];
        const status = item[2];
        
        let joinedStatus = <></>;

        //Determine what to display
        switch (status) {
            case 'Added':
                joinedStatus = <Text className='text-green-600 font-semibold'>Added</Text>;
                break;
            case 'Pending':
                joinedStatus = <Text className='text-gray-500'>Pending</Text>;
                break;
            default:
                joinedStatus = <Button title='Invite' onPress={() => handleInvite(userId)} />;
                break;
        }

        return (
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200 bg-white">
                <Text className="text-lg font-medium text-gray-800">{username}</Text>
                {joinedStatus}
            </View>
        );
    };

    return (
        <View className="flex-1 p-4 bg-white">
            <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
            {loading ? (
                <Text className="text-center text-gray-500 text-base mt-4">Searching...</Text>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={item => item[0]}
                    renderItem={({ item }) => renderAthlete({ item })}
                    ListEmptyComponent={
                        <Text className="text-center text-gray-400 text-base mt-8">
                            No athletes found.
                        </Text>
                    }
                />
            )}
        </View>
    );
};

export default AddAthlete;