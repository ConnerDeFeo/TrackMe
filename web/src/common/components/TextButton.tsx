const TextButton = ({ text, onClick, className }: { text: string; onClick?: () => void; className?: string }) => {
    return (
        <button onClick={onClick} className={`p-2 trackme-red cursor-pointer ${className || ""}`}>
            {text}
        </button>
    );
}

export default TextButton;