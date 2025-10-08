import { useState } from "react"

const TrackmeButton = ({
    children,
    onClick,
    className,
    red,
    gray
}: {
    children: React.ReactNode
    onClick?: () => void | Promise<void>
    className?: string
    red?: boolean
    gray?: boolean
}) => {
    const [loadingState, setLoadingState] = useState<boolean>(false);

    const handleClick = () =>{
        if(!onClick) return;

        const resp = onClick();

        if(resp instanceof Promise){
            setLoadingState(true);
            resp.finally(() => setLoadingState(false));
        }
    }
    return (
        <button
            onClick={handleClick}
            disabled={loadingState}
            className={`
                ${red ? "trackme-bg-red" : gray ? "trackme-bg-gray" : "trackme-bg-blue"}
                text-white px-5 py-2 rounded-lg
                ${loadingState ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${className || ""}
            `}
        >
            {loadingState ? (
                <span className="flex items-center justify-center">
                    <svg
                        className="animate-spin h-5 w-5 mr-2 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                    {children}...
                </span>
            ) : (
                children
            )}
        </button>
    );
}

export default TrackmeButton;