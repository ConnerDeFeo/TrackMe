const TextButton = ({ text, onClick, className, red }: { text: string; onClick?: () => void; className?: string, red?: boolean }) => {
    return (
        <button onClick={onClick} className={`p-2 ${red ? "trackme-red" : "trackme-blue"} ${className || ""}`}>
            {text}
        </button>
    );
}

export default TextButton;