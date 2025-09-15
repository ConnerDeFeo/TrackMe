import React, { useEffect, useState } from 'react';
import { View,  FlatList, Text, Button} from 'react-native';
import CoachService from '../../services/CoachService';
import SearchBar from '../../components/SearchBar';
import UserService from '../../services/UserService';

//Page for adding athletes to a coaches group
const AddAthlete= () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [athletes, setAthletes] = useState<string[][]>([]);
    const [loading, setLoading] = useState(false);

    // Function to handle search input and fetch results
    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        setLoading(true);
        const userId = await UserService.getUserId();
        const res = await CoachService.searchAthletes(searchTerm, userId!);
        if(res.ok){
            const athletes:string[][] = await res.json();
            setAthletes(athletes);
        }
        setLoading(false);
    };

    //Invite athlete to group
    const handleInvite = async (athleteId: string) => {
        const userId = await UserService.getUserId();
        const resp = await CoachService.inviteAthlete(athleteId, userId!);
        if(resp.ok){
            handleSearch(searchTerm); // Re-fetch athletes to update the list
        }
    }

    //Initial fetch of random athletes
    useEffect(() => {
        // Initial fetch to load all athletes when the component mounts
        const fetchAllAthletes = async () => {
            setLoading(true);
            const userId = await UserService.getUserId();
            const res = await CoachService.searchAthletes('', userId!);
            if(res.ok){
                const athletes:string[][] = await res.json();
                setAthletes(athletes);
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
            case 'Requested':
                joinedStatus = <Text className='text-blue-500'>Awating Response</Text>;
                break;
            default:
                joinedStatus = <Button title='Invite' color='black' onPress={() => handleInvite(userId)} />;
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
        <View className="flex-1 p-4 bg-white mt-[4rem]">
            <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} placeholder='Search athletes...' />
            {loading ? (
                <Text className="text-center text-gray-500 text-base mt-4">Searching...</Text>
            ) : (
                <View className="space-y-3">
                    {athletes.map((athlete) => (
                        renderAthlete({ item: athlete })
                    ))}
                </View>
            )}
        </View>
    );
};

export default AddAthlete;