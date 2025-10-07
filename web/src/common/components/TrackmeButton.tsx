const TrackmeButton = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => {
    return (
        <button
            onClick={onClick}
            className={`trackme-bg-blue text-white px-5 py-2 rounded-lg cursor-pointer ${className || ""}`}
        >
            {children}
        </button>
    );
}

export default TrackmeButton;