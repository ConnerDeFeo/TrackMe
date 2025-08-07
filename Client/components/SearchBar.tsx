import { TextInput } from "react-native";

const SearchBar: React.FC<{ searchTerm: string; handleSearch: (term: string) => void }> = ({ searchTerm, handleSearch }) => {
    return (
        <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base bg-gray-50"
            placeholder="Search athletes..."
            value={searchTerm}
            onChangeText={handleSearch}
        />
    );
};
export default SearchBar;