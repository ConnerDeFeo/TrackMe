const GroupHeader = ({groupName}: {groupName: string}) => {
    return (
        <div className="py-4 mx-auto text-center border-b trackme-border-gray max-w-6xl mx-auto relative">
            <button onClick={() => window.history.back()} className="absolute left-0 top-0 text-gray-500 hover:text-trackme-blue focus:outline-none p-6">
                <img src="/assets/images/VectorDown.png" alt="Back" className="h-6 w-6 rotate-90"/>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{groupName}</h1>
        </div>

    );
}

export default GroupHeader;