// Search bar component for any generic purpose search functionality
const SearchBar: React.FC<{ searchTerm: string, setSearchTerm: (term: string) => void, handleSearch: (term: string) => void, placeholder: string }> 
= ({ searchTerm, setSearchTerm, handleSearch, placeholder }) => {
    return (
        <div className="relative">
            <input
                className="border trackme-border-gray rounded-lg px-4 py-3 text-base bg-gray-50 w-full"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(searchTerm); }}
            />
            <button className="absolute right-3 top-[0.4rem] opacity-50 p-2.5" onClick={() => handleSearch(searchTerm)}>
                <img src='/assets/images/Search.png' className="h-5 w-5" alt="Search"/>
            </button>
        </div>
    );
};
export default SearchBar;