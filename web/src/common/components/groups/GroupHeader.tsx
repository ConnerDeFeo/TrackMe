const GroupHeader = ({groupName}: {groupName: string}) => {
    return (
        <div className="py-4 mx-auto text-center border-b trackme-border-gray max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">{groupName}</h1>
        </div>

    );
}

export default GroupHeader;