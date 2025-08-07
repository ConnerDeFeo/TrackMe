import React, { use, useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text} from 'react-native';
import CoachService from '../../../services/CoachService';

//Page for adding athletes to a coaches group
const AddAthlete= () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<string[][]>([]);
    const [loading, setLoading] = useState(false);

    // Function to handle search input and fetch results
    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        setLoading(true);
        const res = await CoachService.searchAthletes(term,"");
        if(res.ok){
            const athletes:string[][] = await res.json();
            setResults(athletes);
        }
        setLoading(false);
    };

    //Initial fetch of random athletes
    useEffect(() => {
        // Initial fetch to load all athletes when the component mounts
        const fetchAllAthletes = async () => {
            setLoading(true);
            const res = await CoachService.searchAthletes('',"");
            if(res.ok){
                const athletes:string[][] = await res.json();
                setResults(athletes);
            }
            setLoading(false);
        };
        fetchAllAthletes();
    }, []);

    return (
        <View className="flex-1 p-4 bg-white">
            <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base bg-gray-50"
                placeholder="Search athletes..."
                value={searchTerm}
                onChangeText={handleSearch}
            />
            {loading ? (
                <Text className="text-center text-gray-500 text-base mt-4">Searching...</Text>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={item => item[0]}
                    renderItem={({ item }) => (
                        <View className="flex-row justify-between items-center p-4 border-b border-gray-200 bg-white">
                            <Text className="text-lg font-medium text-gray-800">{item[0]}</Text>
                            <Text className={item[1] === 'added' ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                                {item[1]}
                            </Text>
                        </View>
                    )}
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