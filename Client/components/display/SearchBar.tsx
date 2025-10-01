import { TextInput } from "react-native";

// Search bar component for any generic purpose search functionality
const SearchBar: React.FC<{ searchTerm: string; handleSearch: (term: string) => void, placeholder: string }> 
= ({ searchTerm, handleSearch, placeholder }) => {
    return (
        <TextInput
            className="border trackme-border-gray rounded-lg px-4 py-3 mb-4 text-base bg-gray-50"
            placeholder={placeholder}
            value={searchTerm}
            onChangeText={handleSearch}
        />
    );
};
export default SearchBar;