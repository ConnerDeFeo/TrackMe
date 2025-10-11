import { useState } from "react"

// Reusable button that shows a loading spinner for async actions
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
    // Tracks whether the button is in a loading state
    const [loadingState, setLoadingState] = useState<boolean>(false)

    // Wraps the provided onClick to handle Promise-based async calls
    const handleClick = () => {
        if (!onClick) return

        const resp = onClick()
        // If onClick returns a Promise, show spinner until it resolves
        if (resp instanceof Promise) {
            setLoadingState(true)
            resp.finally(() => setLoadingState(false))
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loadingState}
            className={`
                ${red ? "trackme-bg-red" : gray ? "bg-gray-300" : "trackme-bg-blue"}
                text-white px-5 py-2 rounded-lg
                ${loadingState ? "opacity-50 cursor-not-allowed" : ""}
                ${className || ""}
            `}
        >
            {loadingState ? (
                // Show spinner + children text when loading
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
                // Default: render children directly
                children
            )}
        </button>
    )
}

export default TrackmeButton