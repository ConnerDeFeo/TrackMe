import { Image, Pressable, TextInput, View } from "react-native";

// Search bar component for any generic purpose search functionality
const SearchBar: React.FC<{ searchTerm: string, setSearchTerm: (term: string) => void, handleSearch: (term: string) => void, placeholder: string }> 
= ({ searchTerm, setSearchTerm, handleSearch, placeholder }) => {
    return (
        <View>
            <TextInput
                className="border trackme-border-gray rounded-lg px-4 py-3 mb-4 text-base bg-gray-50"
                placeholder={placeholder}
                value={searchTerm}
                onChangeText={setSearchTerm}
                onKeyPress={(e)=>{if(e.nativeEvent.key === "Enter"){handleSearch(searchTerm)}}}
            />
            <Pressable className="flex justify-center items-center w-5 h-5 absolute right-3 top-[0.4rem] opacity-50 p-5" onPress={() => handleSearch(searchTerm)}>
                <Image source={require('../../../assets/images/Search.png')} className="h-5 w-5"/>
            </Pressable>
        </View>
    );
};
export default SearchBar;