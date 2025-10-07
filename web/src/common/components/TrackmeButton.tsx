const TrackmeButton = ({ children, onClick, className, red, gray }: { children: React.ReactNode; onClick?: () => void; className?: string, red?: boolean, gray?: boolean }) => {
    return (
        <button
            onClick={onClick}
            className={`trackme-bg-blue text-white px-5 py-2 rounded-lg cursor-pointer ${className || ""} ${red ? "trackme-bg-red" : ""} ${gray ? "trackme-bg-gray" : ""}`}
        >
            {children}
        </button>
    );
}

export default TrackmeButton;