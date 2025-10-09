const UserDisplay = ({username, firstName, lastName} : {username: string, firstName?: string, lastName?: string}) => {
    const displayName = firstName && lastName ? `${firstName} ${lastName}` : username;
    
    return(
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-900">{displayName}</span>
            <span className="text-gray-500 text-sm">@{username}</span>
        </div>
    );
}

export default UserDisplay;