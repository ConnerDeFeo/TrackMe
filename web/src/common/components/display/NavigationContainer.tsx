const NavigationContainer = ({navigateTo, text}: {navigateTo: () => void, text: string}) => {
    return(
        <button 
            onClick={navigateTo}
        >
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded shadow-sm hover:shadow-md transition-all bg-white">
                <p className="text-gray-800 text-xl font-bold text-left"> {text}</p>
            </div>
        </button>
    );
}

export default NavigationContainer;