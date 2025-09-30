import React, { useEffect, useState } from 'react';
import { View, Text, Pressable} from 'react-native';
import AthleteService from '../../services/AthleteService';
import SearchBar from '../../components/SearchBar';
import UserService from '../../services/UserService';


//Page for requesting coaches
const RequestCoaches = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [coaches, setCoaches] = useState<string[][]>([]);
    const [loading, setLoading] = useState(false);

    // Function to handle search input and fetch results
    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        setLoading(true);
        const res = await AthleteService.searchCoaches(searchTerm);
        if(res.ok){
            const coaches:string[][] = await res.json();
            setCoaches(coaches);
        }
        setLoading(false);
    };

    //Request coach
    const handleRequest = async (coachId: string) => {
        const resp = await AthleteService.requestCoach(coachId);
        if(resp.ok){
            handleSearch(searchTerm); // Re-fetch coaches to update the list
        }
    }

    //Initial fetch of random coaches
    useEffect(() => {
        // Initial fetch to load all coaches when the component mounts
        const fetchAllCoaches = async () => {
            await handleSearch('');
        };
        fetchAllCoaches();
    }, []);

    //Renders each coach in the list
    const renderCoach = ({ item }: { item: string[] }) => {
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
            case 'Invited':
                joinedStatus = <Text className='text-blue-500'>Awaiting Response</Text>;
                break;
            default:
                joinedStatus = (
                    <Pressable
                        className="trackme-bg-blue px-4 py-2 rounded"
                        onPress={() => handleRequest(userId)}
                    >
                        <Text className="text-white font-medium">Request</Text>
                    </Pressable>
                );
                break;
        }

        return (
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200 bg-white" key={userId}>
                <Text className="text-lg font-medium text-gray-800">{username}</Text>
                {joinedStatus}
            </View>
        );
    };

    return (
        <View className="flex-1 px-4 mt-4">
            <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} placeholder='Search coaches...' />
            {loading ? (
                <Text className="text-center text-gray-500 text-base mt-4">Searching...</Text>
            ) : (
                <View className="gap-y-3">
                    {coaches.map((coach) => (
                        renderCoach({ item: coach })
                    ))}
                </View>
            )}
        </View>
    );
};

export default RequestCoaches;
