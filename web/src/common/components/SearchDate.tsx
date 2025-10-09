import { useState } from "react";

const SearchDate: React.FC<{
    handleDateSearch: (dateInput: string) => void,
    handleClear: () => void
}> = ({ handleDateSearch, handleClear }) => {
    // Local state for the currently displayed filter label
    const [selectedDate, setSelectedDate] = useState<string>("");

    // Local state for the TextInput value
    const [dateInput, setDateInput] = useState<string>("");

    // Called when user taps "Search"
    const handleSearch = async () => {
        if (!dateInput) return;  // nothing to do if input is empty
        // Remove whitespace
        const trimmedInput = dateInput.trim();
        // Only accept YYYY-MM-DD format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(trimmedInput)) {
            // Update local label and notify parent
            setSelectedDate(trimmedInput);
            handleDateSearch(trimmedInput);
        } else {
            // Alert user if format is invalid
            alert("Please enter a valid date format (YYYY-MM-DD)");
        }
    };

    // Clears both local and external date filters
    const handleClearDateFilter = () => {
        setSelectedDate("");
        setDateInput("");
        handleClear();
    };

    return (
        <div className="flex flex-col w-lg mx-auto my-4 p-4 border border-gray-300 rounded-lg bg-gray-100 gap-2"
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        >
          <input
            type="text"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="w-full p-2 border border-gray-300 rounded text-base bg-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 p-2 border-none rounded bg-blue-500 text-white cursor-pointer text-base"
            >
              Search
            </button>
            <button
              onClick={handleClearDateFilter}
              className="flex-1 p-2 border-none rounded bg-gray-600 text-white cursor-pointer text-base"
            >
              Clear
            </button>
          </div>
          {selectedDate && (
            <p className="mt-3 text-gray-800 font-medium">
              Selected Date: {selectedDate}
            </p>
          )}
        </div>
    );
};
export default SearchDate;